"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import teamPhoto1 from "../../team-photo-1.jpeg";
import teamPhoto2 from "../../team-photo-2.jpeg";
import teamPhoto3 from "../../team-photo-3.jpeg";
import teamPhoto4 from "../../team-photo-4.jpeg";

const stats = [
  {
    target: 43.3,
    decimals: 1,
    prefix: "$",
    suffix: "M",
    label: "Q2 2026 revenue",
  },
  {
    target: 29.1,
    decimals: 1,
    suffix: "K",
    label: "Active learning memberships as of June 30, 2026",
  },
  {
    target: 366,
    prefix: "$",
    label: "Average revenue per member per month, up 5% YoY",
  },
  {
    target: 64.7,
    decimals: 1,
    suffix: "%",
    label: "Gross margin in Q2 2026, up 320 bps YoY",
  },
  {
    target: 10,
    suffix: "M+",
    label: "Tutoring sessions delivered",
    gradient: true,
  },
];

const howRows = [
  {
    number: "01",
    headline: (
      <>
        AI-native at <em>every</em> level — from day-one hires to the C-suite.
      </>
    ),
    detail:
      "Everyone here builds and ships with generative AI. It's table stakes, not a differentiator — and it's how we move 10× faster than legacy education companies.",
  },
  {
    number: "02",
    headline: (
      <>
        Move at <em>founder velocity.</em> Prototype in hours, ship in days.
      </>
    ),
    detail:
      "We measure in real user outcomes, not quarterly roadmaps. If you've ever wanted to skip the JIRA ticket and just build the thing — you'll fit right in.",
  },
  {
    number: "03",
    headline: (
      <>
        Full-stack <em>ownership.</em> You design, build, and run what you ship.
      </>
    ),
    detail:
      "Accountability is a feature of the work — not a ceremony layered on top. The person closest to the problem owns it end-to-end, with the autonomy and tooling to fix it.",
  },
  {
    number: "04",
    headline: (
      <>
        Rewarded on <em>contribution.</em> Compensation tracks impact, not tenure.
      </>
    ),
    detail:
      "We formally measure AI leverage and how well you live our principles. Top performers in their first year out-earn senior peers elsewhere — by a lot.",
  },
];

const aiCards = [
  {
    title: "Engineering",
    span: "span-5",
    intro: "PRs are co-authored. Reviews are AI-assisted. On-call is augmented.",
    bullets: [
      "Every engineer pairs with Claude Code daily — for design, refactors, and tests.",
      "Internal Live + AI agents triage on-call alerts and draft postmortems.",
      "Eval suites gate every model change before it touches a learner session.",
    ],
  },
  {
    title: "Product",
    span: "span-4",
    intro: "Specs become evals before they become tickets.",
    bullets: [
      "Every feature ships with a prompt-and-eval pair, written by the PM.",
      "Discovery research uses AI to synthesize 10× more learner sessions.",
      "Roadmaps are continuous — not quarterly. Decisions get made in days.",
    ],
    footer: "200+ production evals running in CI right now.",
  },
  {
    title: "Across the company",
    span: "span-3 dark-card",
    intro: "Every Nerd has agents.",
    bullets: [
      "Recruiters, ops, finance, legal — everyone has a personal stack of agents.",
      "Internal agent marketplace with 40+ shared, version-controlled agents.",
    ],
  },
  {
    title: "Sales & GTM",
    span: "span-4",
    intro: "Reps run a team — of one human and a fleet of agents.",
    bullets: [
      "Live AI listens on every district call to draft tailored proposals.",
      "Pipeline forecasts get AI-rewritten daily from CRM & email signal.",
      "Top reps spend ~70% of their day talking to humans, not data entry.",
    ],
    footer: "3.4× deal velocity since enabling agents on the floor.",
  },
  {
    title: "Operations & Support",
    span: "span-4",
    intro: "Issues route, escalate, and resolve themselves — until they shouldn't.",
    bullets: [
      "~80% of L1 support tickets resolved without a human touching them.",
      "Humans focus on the hard 20% — and on improving the agents that handle the rest.",
    ],
    footer:
      "Maya, our AI concierge, now handles a meaningful share of in-product customer interactions.",
  },
];

const hubs = [
  "Remote-first · 18 countries",
  "St. Louis, MO · HQ",
  "New York, NY · Hub",
  "Hyderabad, India · Hub",
  "São Paulo, Brazil · LATAM",
  "Mexico City · LATAM",
  "Buenos Aires · LATAM",
  "London, UK",
  "Toronto, Canada",
  "Lisbon, Portugal",
];

const filters = ["All", "Engineering", "Product", "Sales", "Operations"];

function SectionHeader({ eyebrow, title, lede, dark = false }) {
  return (
    <div className="section-head">
      <span className="section-tag">{eyebrow}</span>
      <div>
        <h2 className="section-title">{title}</h2>
        {lede ? <p className="section-lede">{lede}</p> : null}
      </div>
    </div>
  );
}

function CountUp({ stat }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let startTime = 0;
    const duration = 1400;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const run = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(stat.target * easeOutCubic(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(run);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(run);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stat.target]);

  const number =
    stat.decimals && stat.decimals > 0
      ? value.toFixed(stat.decimals)
      : Math.round(value).toLocaleString("en-US");

  return (
    <div className="stat-card" ref={ref}>
      <div className={`stat-number ${stat.gradient ? "gradient-text" : ""}`}>
        {stat.prefix}
        {number}
        {stat.suffix}
      </div>
      <p>{stat.label}</p>
    </div>
  );
}

function LiveAiIllustration() {
  return (
    <div className="ai-visual" aria-label="Live plus AI platform diagram">
      <div className="visual-glow" />
      <svg viewBox="0 0 720 720" role="img">
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#C73E7B" />
            <stop offset="70%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.780 0 0 0 0 0.243 0 0 0 0 0.482 0 0 0 0.75 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path className="connection path-left" d="M350 358 C260 275 224 210 154 192" />
        <path className="connection path-right" d="M372 360 C474 286 528 230 590 204" />
        <path className="connection path-bottom" d="M360 390 C332 486 421 512 476 562" />

        <g className="pulse-rings">
          <circle cx="360" cy="360" r="86" />
          <circle cx="360" cy="360" r="126" />
          <circle cx="360" cy="360" r="166" />
        </g>

        <g className="core" filter="url(#softGlow)">
          <circle cx="360" cy="360" r="80" />
          <text x="360" y="350" textAnchor="middle">
            AI
          </text>
          <text x="360" y="383" textAnchor="middle" className="core-sub">
            core
          </text>
        </g>

        <g className="node-card learner-card">
          <rect x="66" y="116" width="184" height="132" rx="22" />
          <circle cx="104" cy="162" r="18" />
          <text x="132" y="158">Learner</text>
          <text x="132" y="188" className="muted-svg">
            Aria · Algebra
          </text>
          <rect x="96" y="210" width="116" height="8" rx="4" />
        </g>

        <g className="node-card tutor-card">
          <rect x="486" y="120" width="170" height="124" rx="22" />
          <circle cx="526" cy="164" r="18" />
          <circle cx="538" cy="151" r="5" className="gold-dot" />
          <text x="556" y="160">Tutor</text>
          <text x="556" y="190" className="muted-svg">
            live expert
          </text>
        </g>

        <g className="token token-one">
          <rect x="112" y="310" width="116" height="36" rx="18" />
          <text x="170" y="333" textAnchor="middle">
            why x²?
          </text>
        </g>
        <g className="token token-two">
          <rect x="380" y="252" width="154" height="36" rx="18" />
          <text x="457" y="275" textAnchor="middle">
            scaffold + hint
          </text>
        </g>
        <g className="token token-three">
          <rect x="468" y="436" width="138" height="36" rx="18" />
          <text x="537" y="459" textAnchor="middle">
            Aria got it ✓
          </text>
        </g>
        <g className="token token-four">
          <rect x="176" y="498" width="136" height="36" rx="18" />
          <text x="244" y="521" textAnchor="middle">
            visual proof →
          </text>
        </g>

        <g className="readout mastery">
          <rect x="84" y="520" width="178" height="86" rx="18" />
          <text x="108" y="555">+18% mastery</text>
          <polyline points="108,582 132,574 156,579 180,558 204,564 232,542" />
        </g>
        <g className="readout signals">
          <rect x="456" y="528" width="178" height="86" rx="18" />
          <text x="480" y="562">847 signals/sec</text>
          <rect x="486" y="584" width="12" height="14" rx="3" />
          <rect x="506" y="574" width="12" height="24" rx="3" />
          <rect x="526" y="564" width="12" height="34" rx="3" />
          <rect x="546" y="552" width="12" height="46" rx="3" />
          <rect x="566" y="570" width="12" height="28" rx="3" />
        </g>
      </svg>
      <div className="visual-bar">
        <span>
          <span className="pulse-dot teal" /> Live · ambient view
        </span>
        <strong>12,847 sessions in flight</strong>
      </div>
    </div>
  );
}

function RolesSection() {
  const [jobs, setJobs] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loadingState, setLoadingState] = useState("loading");

  useEffect(() => {
    let active = true;

    fetch("/api/jobs")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load jobs");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setJobs(data);
        setLoadingState("ready");
      })
      .catch(() => {
        if (!active) return;
        setLoadingState("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const result = { All: jobs.length };
    for (const filter of filters.slice(1)) {
      result[filter] = jobs.filter((job) => job.department === filter).length;
    }
    return result;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All") return jobs;
    return jobs.filter((job) => job.department === activeFilter);
  }, [activeFilter, jobs]);

  return (
    <section className="section roles dark-section" id="roles">
      <div className="wrap">
        <SectionHeader eyebrow="Open roles" title="Find your next role." />

        <p className="roles-principles">
          We're hiring across Engineering, Product, Sales, and Operations — remote,
          global, and built for builders. Whether you're closing deals, keeping
          systems running, or shipping code — the same principles apply here. We move
          fast, reward contribution, and hold ourselves accountable to learners, not
          process. Every role at Nerdy is a front-row seat to one of the most
          consequential shifts in education.
        </p>

        <div className="roles-filter" aria-label="Filter open roles by department">
          {filters.map((filter) => (
            <button
              className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter} <span>{counts[filter] || 0}</span>
            </button>
          ))}
        </div>

        {loadingState === "error" ? (
          <div className="roles-fallback">
            Unable to load roles — please visit careers.nerdy.com/jobs.
          </div>
        ) : (
          <ul className="role-list" aria-busy={loadingState === "loading"}>
            {(loadingState === "loading" ? [] : filteredJobs).map((job) => (
              <li key={`${job.title}-${job.location}`}>
                <a
                  className="role-row"
                  href={job.applyUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="role-primary">
                    <div className="role-name">
                      {job.title}
                      {isNewRole(job.postedDate) ? (
                        <span className="role-new">NEW</span>
                      ) : null}
                    </div>
                    <div className="role-meta">
                      {job.department} · {job.team} · {job.type}
                    </div>
                    <div className="role-hook">{job.hook || job.description}</div>
                  </div>
                  <div className="role-posted">{formatPosted(job.postedDate)}</div>
                  <div className="role-category">{job.department}</div>
                  <div className="role-location">
                    <span className="tiny-dot teal" />
                    {job.location}
                  </div>
                  <div className="role-arrow">→</div>
                </a>
              </li>
            ))}
            {loadingState === "loading" ? (
              <li className="roles-loading">Loading open roles…</li>
            ) : null}
          </ul>
        )}

        {loadingState !== "error" ? (
          <div className="roles-footer">
            <span>
              Showing {filteredJobs.length} of {jobs.length} roles.
            </span>
            <a
              href="https://careers.nerdy.com/jobs"
              className="roles-all-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View all roles on careers.nerdy.com <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BenchForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/bench-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to send right now.");
      }

      setStatus("success");
    } catch (submissionError) {
      setError(submissionError.message);
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="bench-success" role="status">
        <h3>Thanks — we got it.</h3>
        <p>
          A real human on our recruiting or engineering team will personally review
          your work.
        </p>
      </div>
    );
  }

  return (
    <form className="bench-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Hi Nerdy — here's something I built. It does X, learns from Y, and was made with Z. Here's why I'd be a great fit for the Product Engineering bench…"
        required
        minLength={20}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <div className="bench-form-bar">
        <span>
          <span className="pulse-dot magenta" /> Reviewed by recruiting &
          engineering leaders · careers@nerdy.com
        </span>
        <button className="btn-primary" disabled={status === "submitting"} type="submit">
          {status === "submitting" ? "Sending…" : "Send →"}
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}

export default function CareersPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <nav className={scrolled ? "scrolled" : ""} aria-label="Primary navigation">
        <div className="nav-inner">
          <a className="logo" href="/" aria-label="Nerdy Careers — home">
            <img src="/nerdy-wordmark.svg" alt="Nerdy" />
            <span className="logo-divider" aria-hidden="true" />
            <span className="logo-careers">Careers</span>
          </a>
          <ul className="nav-links">
            <li>
              <a href="#mission">Our mission</a>
            </li>
            <li>
              <a href="#how">How we work</a>
            </li>
            <li>
              <a href="#roles">Open roles</a>
            </li>
            <li>
              <a href="#resources">Candidate prep</a>
            </li>
            <li>
              <a href="https://www.nerdy.com/" rel="noopener noreferrer" target="_blank">
                Who we are
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-glow" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <span className="pulse-dot magenta" /> Now hiring · Engineering,
              Product & Sales
            </div>
            <h1>
              Build the <span className="gradient-text">Live&nbsp;+&nbsp;AI</span>{" "}
              Platform Transforming
              <br />
              How People Learn.
            </h1>
            <p className="hero-sub">
              At Nerdy (NYSE: NRDY), we pair expert instructors with real-time
              generative AI to deliver personalized learning at scale — for every
              learner, from preschool fundamentals to professional mastery.
            </p>
            <div className="hero-actions">
              <a href="#roles" className="btn-primary">
                Explore open roles <span aria-hidden="true">→</span>
              </a>
              <a href="#how" className="btn-secondary">
                How we work
              </a>
            </div>
          </div>
          <LiveAiIllustration />
        </div>
      </section>

      <section className="stats-strip" aria-label="Company statistics">
        <div className="wrap stats-grid">
          {stats.map((stat) => (
            <CountUp key={stat.label} stat={stat} />
          ))}
        </div>
        <div className="wrap">
          <div className="gradient-divider thick" />
        </div>
      </section>

      <section className="section mission" id="mission">
        <div className="wrap">
          <SectionHeader
            eyebrow="The mission"
            title={
              <>
                Transforming how people learn — for the{" "}
                <span className="gradient-text">next 200 years.</span>
              </>
            }
            lede="Classrooms have relied on a one-size-fits-all model for two centuries. That era is giving way to something better. Our Live + AI™ platform makes genuinely personalized learning — at global scale — the new default."
          />
          <figure className="quote-card">
            <div className="quote-mark gradient-text">"</div>
            <blockquote>
              Artificial intelligence is rewriting education — and its power is
              greatest when it amplifies the human spark at learning's core. Join us
              and build that future.
            </blockquote>
            <figcaption>
              Chuck Cohn, <span>Founder & CEO, Nerdy</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section how dark-section" id="how">
        <div className="dark-glow" />
        <div className="wrap">
          <SectionHeader
            eyebrow="How we work"
            title={
              <>
                An AI-native, free-market meritocracy moving at{" "}
                <span className="gradient-text">founder pace.</span>
              </>
            }
            lede="Four principles shape every team, decision, and hire. They're how we stay accountable to each other — and to our learners."
          />
          <div className="principles">
            {howRows.map((row) => (
              <div className="principle-row" key={row.number}>
                <div className="principle-number gradient-text">{row.number}</div>
                <h3>{row.headline}</h3>
                <p>{row.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section ai-practice" id="ai-in-the-work">
        <div className="wrap">
          <SectionHeader
            eyebrow="AI, in practice"
            title="It's not a slogan — it's how the work actually gets done."
            lede={'"AI-first" gets thrown around a lot. Here\'s what it concretely looks like across the company on any given Tuesday.'}
          />
          <div className="ai-card-grid">
            {aiCards.map((card) => (
              <article className={`practice-card ${card.span}`} key={card.title}>
                <span className="practice-label">{card.title}</span>
                <h3>{card.intro}</h3>
                <ul>
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {card.footer ? <p className="practice-stat">{card.footer}</p> : null}
              </article>
            ))}
            <a className="practice-card span-4 dark-card cta-card" href="#roles">
              <span className="practice-label teal-label">→ Want in?</span>
              <h3>
                If this sounds like the job description you've been waiting for,
                we're hiring.
              </h3>
              <span className="text-link gradient-text">See open roles →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="hubs-strip" aria-label="Nerdy hubs and locations">
        <div className="marquee-track">
          {[...hubs, ...hubs].map((hub, index) => (
            <span className="hub-pill" key={`${hub}-${index}`}>
              <span className="tiny-dot teal" /> {hub}
            </span>
          ))}
        </div>
      </section>

      <section className="section team-section">
        <div className="wrap">
          <SectionHeader
            eyebrow="The team"
            title="Meet the Nerds."
            lede="A global team of engineers, educators, designers, and operators building the future of learning together."
          />
          <div className="team-grid">
            <figure className="team-photo main-photo">
              <img src={teamPhoto1.src} alt="The Nerdy team at their annual summit" />
            </figure>
            <figure className="team-photo">
              <img src={teamPhoto2.src} alt="Nerdy team at a baseball-themed gathering" />
            </figure>
            <figure className="team-photo">
              <img src={teamPhoto3.src} alt="Nerdy team at an evening meet-up" />
            </figure>
            <figure className="team-photo">
              <img src={teamPhoto4.src} alt="Nerdy team around a rooftop firepit" />
            </figure>
          </div>
        </div>
      </section>

      <div className="gradient-divider section-transition" />

      <RolesSection />

      <section className="section resources" id="resources">
        <div className="wrap">
          <SectionHeader
            eyebrow="Candidate prep"
            title="Everything you need to ace your interviews."
            lede="Great candidate experiences start with transparency. Read up on how we hire, what we look for, and what it's actually like to work here — before you even apply."
          />
          <div className="resources-grid">
            <a className="resource-card featured dark-card" href="/nerdy-by-nature">
              <span className="resource-tag">Candidate guide</span>
              <h3>Nerdy by Nature: a candidate's guide to our hiring process.</h3>
              <p>
                Walk through our end-to-end interview process, get resume tips, and read
                our policies — including how (and when) to use AI during your interview.
              </p>
              <span className="resource-link">Read the guide →</span>
            </a>
            <a className="resource-card" href="/ai-at-nerdy">
              <span className="resource-tag">A note from the team</span>
              <h3>AI at Nerdy.</h3>
              <p>
                A short, candid look at what "AI-first" actually means in practice —
                for the engineers shipping product, the learning scientists shaping
                curriculum, the operators running the business, and everyone in
                between.
              </p>
              <span className="resource-link">Read the article →</span>
            </a>
            <a className="resource-card" href="/day-in-the-life">
              <span className="resource-tag">Day in the life</span>
              <h3>A day in the life of an AI-Native Engineer at Nerdy.</h3>
              <p>
                What it actually looks like to build on Live + AI — how our engineers
                work, ship, and use AI as a force multiplier.
              </p>
              <span className="resource-link">Read the article →</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bench-cta">
        <div className="bench-glow" />
        <div className="wrap bench-inner">
          <h2>
            Product Engineer?{" "}
            <span className="gradient-text">AI-native builder?</span> Show us what
            you've made.
          </h2>
          <p>
            We're always looking for great talent — no open role required. Send us
            something you've built: a project, a prototype, a tool, a side quest. Every
            submission gets a personal review from recruiting and engineering leaders.
            We're building our bench for what's next.
          </p>
          <BenchForm />
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <div className="footer-brand">
            <img src="/nerdy-wordmark.svg" alt="Nerdy" />
            <p>
              Nerdy is the parent company of Varsity Tutors — a leading platform for
              live, AI-powered learning.
            </p>
          </div>
          <div className="footer-col">
            <h3>Company</h3>
            <a href="https://www.nerdy.com/about">About Nerdy</a>
            <a href="https://www.varsitytutors.com/">Varsity Tutors</a>
            <a href="https://www.nerdy.com/investors">Investor relations</a>
            <a href="https://www.nerdy.com/press">Press</a>
          </div>
          <div className="footer-col">
            <h3>Legal</h3>
            <a href="https://www.nerdy.com/privacy">Privacy policy</a>
            <a href="https://www.nerdy.com/terms">Terms of use</a>
            <a href="https://www.nerdy.com/accessibility">Accessibility</a>
            <a href="/candidate-privacy">Candidate privacy</a>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© 2026 Nerdy Inc. All rights reserved.</span>
          <span className="ticker">NYSE: NRDY</span>
        </div>
      </footer>
    </main>
  );
}

function isNewRole(postedDate) {
  const ageDays = (Date.now() - new Date(postedDate).getTime()) / 86400000;
  return ageDays <= 7;
}

function formatPosted(postedDate) {
  const ageDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(postedDate).getTime()) / 86400000),
  );

  if (ageDays === 0) return "posted today";
  if (ageDays === 1) return "posted 1 day ago";
  return `posted ${ageDays} days ago`;
}
