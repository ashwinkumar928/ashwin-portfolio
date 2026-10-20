import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync, inflateSync } from 'node:zlib'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const name = Buffer.from(type)
  const body = Buffer.concat([name, data])
  const head = Buffer.alloc(4)
  head.writeUInt32BE(data.length)
  const check = Buffer.alloc(4)
  check.writeUInt32BE(crc32(body))
  return Buffer.concat([head, body, check])
}

function decodePng(file) {
  const png = file
  if (png.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Input is not a PNG.')
  let width, height, bitDepth, colorType, interlace
  const data = []
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset)
    const type = png.toString('ascii', offset + 4, offset + 8)
    const part = png.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = part.readUInt32BE(0); height = part.readUInt32BE(4)
      bitDepth = part[8]; colorType = part[9]; interlace = part[12]
    } else if (type === 'IDAT') data.push(part)
    else if (type === 'IEND') break
    offset += length + 12
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType) || interlace !== 0) {
    throw new Error('Expected a non-interlaced, 8-bit RGB or RGBA PNG.')
  }
  const channels = colorType === 6 ? 4 : 3
  const stride = width * channels
  const packed = inflateSync(Buffer.concat(data))
  const raw = Buffer.alloc(height * stride)
  let inputOffset = 0
  for (let y = 0; y < height; y++) {
    const filter = packed[inputOffset++]
    const rowStart = y * stride
    for (let x = 0; x < stride; x++) {
      const value = packed[inputOffset++]
      const left = x >= channels ? raw[rowStart + x - channels] : 0
      const up = y > 0 ? raw[rowStart - stride + x] : 0
      const upperLeft = y > 0 && x >= channels ? raw[rowStart - stride + x - channels] : 0
      let predictor = 0
      if (filter === 1) predictor = left
      else if (filter === 2) predictor = up
      else if (filter === 3) predictor = Math.floor((left + up) / 2)
      else if (filter === 4) {
        const p = left + up - upperLeft
        const pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - upperLeft)
        predictor = pa <= pb && pa <= pc ? left : pb <= pc ? up : upperLeft
      } else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}.`)
      raw[rowStart + x] = (value + predictor) & 255
    }
  }
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0, j = 0; i < raw.length; i += channels, j += 4) {
    rgba[j] = raw[i]; rgba[j + 1] = raw[i + 1]; rgba[j + 2] = raw[i + 2]
    rgba[j + 3] = channels === 4 ? raw[i + 3] : 255
  }
  return { width, height, rgba }
}

function encodePng({ width, height, rgba }) {
  const stride = width * 4
  const scanlines = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y++) rgba.copy(scanlines, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0); header.writeUInt32BE(height, 4)
  header[8] = 8; header[9] = 6
  return Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header), chunk('IDAT', deflateSync(scanlines, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ])
}

function cropToForeground({ width, height, rgba }, paddingRatio = 0.03) {
  let left = width, right = -1, top = height, bottom = -1
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (rgba[(y * width + x) * 4 + 3] > 24) {
      left = Math.min(left, x); right = Math.max(right, x)
      top = Math.min(top, y); bottom = Math.max(bottom, y)
    }
  }
  if (right < left || bottom < top) throw new Error('No foreground alpha found in portrait input.')
  const padding = Math.round(Math.min(width, height) * paddingRatio)
  left = Math.max(0, left - padding); right = Math.min(width - 1, right + padding)
  top = Math.max(0, top - padding); bottom = Math.min(height - 1, bottom + padding)
  const croppedWidth = right - left + 1, croppedHeight = bottom - top + 1
  const cropped = Buffer.alloc(croppedWidth * croppedHeight * 4)
  for (let y = 0; y < croppedHeight; y++) {
    rgba.copy(cropped, y * croppedWidth * 4, ((top + y) * width + left) * 4, ((top + y) * width + right + 1) * 4)
  }
  return { width: croppedWidth, height: croppedHeight, rgba: cropped }
}

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value))
const smoothstep = (a, b, value) => {
  const t = clamp((value - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function processPortrait(image, seed, tuning) {
  const { width, height, rgba } = image
  const { cellSize, contrast, brightness, particleCount } = tuning
  const original = Buffer.from(rgba)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      const alpha = original[index + 3]
      if (alpha < 3) continue
      const luminance = (0.2126 * original[index] + 0.7152 * original[index + 1] + 0.0722 * original[index + 2]) / 255
      const tone = clamp((luminance - 0.5) * contrast + 0.5 + brightness)
      const screenX = (x % cellSize) - cellSize / 2
      const screenY = (y % cellSize) - cellSize / 2
      const inkRadius = (1 - tone) * (cellSize * 0.43)
      const dot = screenX * screenX + screenY * screenY < inkRadius * inkRadius
      let value = Math.pow(tone, 0.88) * 255 * (dot ? 0.43 : 1)

      let edge = 0
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (dx * dx + dy * dy > 10 || (!dx && !dy)) continue
          const nx = x + dx, ny = y + dy
          const neighbor = nx < 0 || ny < 0 || nx >= width || ny >= height ? 0 : original[(ny * width + nx) * 4 + 3]
          edge = Math.max(edge, (alpha - neighbor) / 255 * (1 - Math.hypot(dx, dy) / 4))
        }
      }
      const cool = (1 - smoothstep(0.33, 0.66, x / width)) * edge * 0.22
      const warm = smoothstep(0.34, 0.68, x / width) * edge * 0.23
      rgba[index] = clamp(value + cool * 26 + warm * 68, 0, 255)
      rgba[index + 1] = clamp(value + cool * 16 + warm * 16, 0, 255)
      rgba[index + 2] = clamp(value + cool * 8 - warm * 20, 0, 255)
    }
  }

  let randomState = seed >>> 0
  const random = () => ((randomState = (randomState * 1664525 + 1013904223) >>> 0) / 4294967296)
  const bounds = []
  for (let y = 0; y < height; y++) {
    let left = width, right = -1
    for (let x = 0; x < width; x++) if (original[(y * width + x) * 4 + 3] > 24) { left = Math.min(left, x); right = x }
    if (right >= left) bounds.push({ y, left, right })
  }
  const lowerBounds = bounds.filter(({ y }) => y > height * 0.42)
  for (let i = 0; i < particleCount && lowerBounds.length; i++) {
    const row = lowerBounds[Math.floor(random() * lowerBounds.length)]
    const side = random() < 0.5 ? -1 : 1
    const x = Math.round((side < 0 ? row.left : row.right) + side * (3 + random() * Math.min(width * 0.075, 38)))
    const y = Math.round(row.y + (random() - 0.5) * 20)
    const radius = random() < 0.84 ? 1 : 2
    const alpha = Math.round(46 + random() * 72)
    const color = random() < 0.53 ? [158, 190, 208] : [202, 133, 96]
    for (let py = -radius; py <= radius; py++) for (let px = -radius; px <= radius; px++) {
      const distance = Math.hypot(px, py)
      const tx = x + px, ty = y + py
      if (distance > radius || tx < 0 || ty < 0 || tx >= width || ty >= height) continue
      const index = (ty * width + tx) * 4
      const cover = alpha * (1 - distance / (radius + 0.45))
      const prior = rgba[index + 3]
      const combined = Math.round(cover + prior * (1 - cover / 255))
      for (let channel = 0; channel < 3; channel++) {
        rgba[index + channel] = prior === 0 ? color[channel] : Math.round((rgba[index + channel] * prior * (1 - cover / 255) + color[channel] * cover) / Math.max(1, combined))
      }
      rgba[index + 3] = combined
    }
  }
  return image
}

const portraits = [
  { source: 'ashwin-hero-source.png', target: 'ashwin-hero-cutout.png', seed: 9421, tuning: { cellSize: 4, contrast: 1.34, brightness: 0.015, particleCount: 145 } },
  { source: 'ashwin-about-source.png', target: 'ashwin-about-cutout.png', seed: 5287, tuning: { cellSize: 3.6, contrast: 1.27, brightness: 0.045, particleCount: 110 } },
]

for (const portrait of portraits) {
  const sourcePath = join(root, 'assets', 'portrait-cutouts', portrait.source)
  const image = cropToForeground(decodePng(await readFile(sourcePath)))
  await writeFile(join(root, 'public', 'images', portrait.target), encodePng(processPortrait(image, portrait.seed, portrait.tuning)))
  console.log(`${portrait.target}: ${image.width}x${image.height} processed from ${portrait.source}`)
}
