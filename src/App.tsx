import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Code2, Mail, Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const nav = [['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Projects', 'projects'], ['Education', 'education'], ['Contact', 'contact']] as const

const projects = [
  {
    n: '01',
    name: 'Karviam',
    type: 'LOCAL WORK MARKETPLACE',
    description:
      'A two-sided local work marketplace where people can post jobs and discover short-term earning opportunities from the same account.',
    stack: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL', 'REST APIs'],
    link: 'https://karviam.in',
    linkLabel: 'Live Demo',
    image: '/images/projects/karviam.png',
    visual: 'market',
    note: 'DISCOVER WORK / CREATE OPPORTUNITY',
  },
  {
    n: '02',
    name: 'Devrooms',
    type: 'AI · DEVELOPER COMMUNITY',
    description:
      'An AI-powered developer collaboration platform with programming help, code review assistance, and collaborative spaces with invite-based access.',
    stack: ['MERN stack', 'Clerk Authentication', 'Role-based access'],
    link: 'https://devrooms-chatbot.vercel.app/',
    linkLabel: 'Live Demo',
    image: '/images/projects/devrooms.png',
    visual: 'community',
    note: 'BUILD TOGETHER / LEARN IN PUBLIC',
  },
  {
    n: '03',
    name: 'AI-Powered Job Market Skill Analyzer',
    type: 'DATA · MACHINE LEARNING',
    description:
      'A data-analysis application that explores job postings, surfaces in-demand skills, and helps users spot role-specific skill gaps and recommendations.',
    stack: ['Python', 'Pandas', 'Scikit-learn', 'Streamlit'],
    link: 'https://ai-job-skill-analyzer-wqzumg8xfcwiifstaejwtu.streamlit.app/',
    linkLabel: 'Live Demo',
    image: '/images/projects/job-skill-analyzer.png',
    visual: 'signal',
    note: 'JOB MARKET / SKILL INSIGHTS',
  },
]

const skillGroups = [
  ['01', 'Languages', 'Java · JavaScript · C · Python'],
  ['02', 'Frontend', 'React.js · HTML5 · CSS3'],
  ['03', 'Backend', 'Node.js · Express.js · REST APIs'],
  ['04', 'Databases', 'MySQL · PostgreSQL · MongoDB'],
  ['05', 'AI & Data', 'Machine Learning · Generative AI · Prompt Engineering · Data Analysis · Pandas · Scikit-learn · Streamlit'],
  ['06', 'Foundations', 'Data Structures & Algorithms · OOP · DBMS'],
  ['07', 'Tools', 'Git · GitHub'],
]


function Portrait({ about = false }: { about?: boolean }) {
  const image = about
    ? '/images/ashwin-about-cutout.png'
    : '/images/ashwin-hero-cutout.png';

  return (
    <figure
      className={`portrait${about ? ' portrait--about' : ''}`}
      aria-label={about ? 'Ashwin Kumar — about' : 'Ashwin Kumar — portrait'}
    >
      <img
        className="portrait__image"
        src={image}
        alt={about ? 'Ashwin Kumar, seated portrait' : 'Ashwin Kumar'}
        draggable={false}
      />

      {!about && (
        <>
          <span className="portrait__tag">01 / PRESENCE</span>
          <span className="portrait__hint">SCROLL TO REVEAL</span>
        </>
      )}
    </figure>
  );
}


function ProjectVisual({ kind }: { kind: string }) {
  if (kind === 'market') return <div className="visual visual--market"><div className="visual-top"><span>k / local work</span><span>◉ Nearby</span></div><div className="market-copy"><small>GOOD WORK, CLOSE TO HOME.</small><strong>Find your<br/><em>next thing.</em></strong><span className="market-cta">Explore opportunities <ArrowRight size={14}/></span></div><div className="market-list"><span>Illustrative interface</span><b>Job discovery <i>Nearby</i></b><b>Work categories <i>Flexible</i></b></div><div className="visual-index">KA / 001</div></div>
  if (kind === 'community') return <div className="visual visual--community"><div className="terminal-head"><i/><i/><i/><span>devrooms / workspace · illustrative</span></div><div className="terminal-body"><aside><b>dr</b><span>◈</span><span>⌘</span><span>◎</span><span>＋</span></aside><div className="chat"><small># general · community</small><div className="chat-line"><b>AK</b><p><strong>ashwin</strong><br/>Anyone up for reviewing this API route?</p></div><div className="codebox">POST /api/projects<br/><span>→ authenticate user</span><br/><span>→ validate payload</span></div><div className="ai-reply"><span>✳ AI ASSIST</span><p>Consider validating the request body before writing to the database.</p></div></div></div></div>
  return <div className="visual visual--signal"><div className="signal-top"><span>SKILL SIGNAL / ILLUSTRATIVE</span><span>ANALYSIS 01</span></div><div className="signal-title">What the market<br/>is asking for.</div><div className="chart"><div className="chart-labels"><span>Python</span><span>SQL</span><span>React</span><span>Cloud</span><span>ML</span></div><div className="chart-bars"><i style={{ '--bar': '88%' } as CSSProperties}/><i style={{ '--bar': '75%' } as CSSProperties}/><i style={{ '--bar': '61%' } as CSSProperties}/><i style={{ '--bar': '48%' } as CSSProperties}/><i style={{ '--bar': '37%' } as CSSProperties}/></div></div><div className="signal-foot">ROLE MATCH <b>DATA ANALYST</b><span>SKILL GAP →</span></div></div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [formState, setFormState] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = prefersReducedMotion ? null : gsap.context(() => {
      gsap.to('.hero .portrait__image', {
        yPercent: -3,
        scale: 1.035,
        opacity: 0.82,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.7 },
      })

      gsap.to(".hero .portrait__image", {
  ease: "none",
  scrollTrigger: {
    trigger: ".hero h1",
    start: "top 45%",
    end: "bottom 20%",
    scrub: 0.5,
  },
});

      gsap.to(".hero .portrait", {
         opacity: 0,
         ease: "none",
          scrollTrigger: {
         trigger: ".about",
          start: "top  85%",
           end: "top  35%",
          scrub: 0.5,
  },
});
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    }, root)
    return () => { window.removeEventListener('scroll', onScroll); ctx?.revert() }
  }, [])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) { setFormState('Please enter your name, a valid email, and a message.'); return }
    const subject = encodeURIComponent(`Portfolio message from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)
    setFormState('Your email app will open with this message ready to send.')
    window.location.href = `mailto:ashwinkumaryt9386@gmail.com?subject=${subject}&body=${body}`
  }

  return <main ref={root}>
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <a className="wordmark" href="#home" aria-label="Ashwin Kumar, home">AK<span>.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <a className="header-cta" href="#contact">LET'S TALK <ArrowUpRight size={14}/></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} aria-label="Mobile navigation">{nav.map(([label, id], index) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}<ArrowUpRight size={16}/></a>)}</motion.nav>}</AnimatePresence>
    </header>

    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-meta"><span><i/> FULL-STACK DEVELOPER <b>·</b> CREATIVE BUILDER</span><span>BASED IN INDIA <b>·</b> OPEN TO WHAT'S NEXT</span></div>
      <div className="hero-stage"><div className="hero-side-note"><span>ENGINEERING<br/>EDUCATION<br/>HUMAN CONNECTION</span><span className="hero-cross">+</span></div><Portrait /><p className="portrait-caption">A HUMAN PERSPECTIVE<br/>ON TECHNOLOGY</p>
        <h1 id="hero-title">ASHWIN <span>KUMAR</span></h1>
      </div>
      <div className="hero-bottom"><div><p className="hero-subtitle">I build things that work.</p><p className="hero-description">Computer Science student building full-stack products<br className="desktop-break"/> and exploring AI-powered applications.</p></div><div className="hero-actions"><a className="button button--light" href="#projects">Explore my work <ArrowDownRight size={16}/></a><a className="text-link" href="#contact">Let's connect <ArrowUpRight size={15}/></a></div></div>
      <div className="hero-endline"><a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><ArrowDown size={13}/></a><div className="hero-serial">PORTFOLIO / 2026</div></div>
    </section>

    
<section className="about section-wrap" id="about" data-reveal>
  <div className="section-kicker">
    <span>01 / THE PERSON</span>
    <span>ABOUT</span>
  </div>

  <div className="about-grid">
    <div className="about-heading">
      <p className="eyebrow">A LITTLE ABOUT WHAT I DO</p>
      <h2>
        Curiosity,
        <br />
        <em>made useful.</em>
      </h2>

      <div className="about-highlights">
  <span>01</span>
  <p>Full-stack development</p>
  <span>02</span>
  <p>AI-powered applications</p>
  <span>03</span>
  <p>Building useful products</p>
</div>

    </div>

    <div className="about-copy">
      <span className="red-rule" />
      <p>
        I'm a Computer Science student interested in building useful digital
        products, full-stack web applications, and AI-powered tools.
      </p>
      <p>
        I enjoy turning ideas into working experiences, from user-facing
        interfaces to backend APIs and data-driven applications. The
        interesting part is making every layer feel like it belongs.
      </p>
      <a className="text-link" href="#projects">
        A few things I've made <ArrowDownRight size={15} />
      </a>
      <div className="about-stamp">
        CS
        <br />
        <small>2023—27</small>
      </div>
    </div>
  </div>
</section>

    <section className="skills section-wrap" id="skills" data-reveal><div className="section-kicker"><span>02 / THE TOOLKIT</span><span>SKILLS & CRAFT</span></div><div className="skills-intro"><h2>Good work starts<br/>with <em>good tools.</em></h2><p>A practical toolkit for building across the stack, exploring data, and getting ideas into the world.</p></div><div className="skill-list">{skillGroups.map(([n, title, list]) => <div className="skill-row" key={n}><span className="skill-num">{n}</span><h3>{title}</h3><p>{list}</p><ArrowUpRight className="skill-arrow" size={16}/></div>)}</div></section>

    
<section className="projects section-wrap" id="projects">
  <div className="section-kicker" data-reveal>
    <span>03 / SELECTED WORK</span>
    <span>THREE PROJECTS</span>
  </div>

  <div className="projects-heading" data-reveal>
    <h2>
      Built with<br />
      <em>intent.</em>
    </h2>
    <p>
      Different problems, different tools.
      <br />
      A closer look at what I've been working on.
    </p>
  </div>

  <div className="project-list">
    {projects.map((p) => (
      <article
        className={`project project--${p.visual}`}
        key={p.n}
        data-reveal
      >
        <div className="project-visual-wrap">
          <img
            className="project-screenshot"
            src={p.image}
            alt={`${p.name} project screenshot`}
            loading="lazy"
            decoding="async"
          />
          <span className="project-number">
            {p.n} / 03 · SELECTED WORK
          </span>
        </div>

        <div className="project-info">
          <div className="project-title-row">
            <div>
              <span className="eyebrow">{p.type}</span>
              <h3>{p.name}</h3>
            </div>

            <a
              className="project-link"
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${p.name} live demo in a new tab`}
            >
              Live Demo <ArrowUpRight size={15} />
            </a>
          </div>

          <p className="project-description">{p.description}</p>

          <div className="project-tags">
            {p.stack.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="project-note">{p.note}</div>
        </div>
      </article>
    ))}
  </div>
</section>


    <section className="education section-wrap" id="education" data-reveal><div className="section-kicker"><span>04 / THE FOUNDATION</span><span>EDUCATION</span></div><div className="education-grid"><div><p className="eyebrow">LEARNING IN PROGRESS</p><h2>Built on<br/><em>the basics.</em></h2></div><div className="education-list"><article className="education-item education-item--primary"><span className="education-date">2023 — 2027</span><div><h3>B.Tech — Computer Science</h3><p>Kalinga Institute of Industrial Technology</p><small>CGPA&nbsp; 7.18 / 10</small></div><span className="education-mark">01</span></article>
<article className="education-item">
  <span className="education-date">2022</span>
  <div>
    <h3>Class 12</h3>
    <p>Adarsh Vikas Vidyalaya</p>
    <small>Percentage&nbsp; 75.8%</small>
  </div>
  <span className="education-mark">02</span>
</article>
<article className="education-item"><span className="education-date">CERTIFICATION</span><div><h3>AWS Cloud Fundamentals</h3><p>Certification</p></div><span className="education-mark">04</span></article></div></div></section>

    <section className="contact section-wrap" id="contact" data-reveal><div className="section-kicker"><span>05 / THE NEXT THING</span><span>CONTACT</span></div><div className="contact-grid"><div className="contact-copy"><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let's<br/><em>connect.</em></h2><p>Have an idea, a project, or an opportunity? I'd be happy to hear from you.</p><a className="email-link" href="mailto:ashwinkumaryt9386@gmail.com">ashwinkumaryt9386@gmail.com <ArrowUpRight size={15}/></a><div className="social-links"><a href="https://github.com/ashwinkumar928" target="_blank" rel="noreferrer"><Code2 size={16}/> GitHub <ArrowUpRight size={13}/></a><a href="mailto:ashwinkumaryt9386@gmail.com"><Mail size={16}/> Email <ArrowUpRight size={13}/></a></div></div><form className="contact-form" onSubmit={submit} noValidate><label>Your name<input name="name" type="text" placeholder="Name" autoComplete="name" required/></label><label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label><label>Your message<textarea name="message" placeholder="Tell me a little about it…" rows={4} required/></label><button className="button button--light" type="submit">Prepare email <ArrowUpRight size={15}/></button><p className="form-note" aria-live="polite">{formState || 'Submitting opens your email app; nothing is sent from this site.'}</p></form></div></section>

    <footer className="footer"><a className="wordmark" href="#home">AK<span>.</span></a><span>DESIGNED & BUILT BY ASHWIN KUMAR</span><a href="#home">BACK TO TOP ↑</a><span>© 2026</span></footer>
  </main>
}

export default App
