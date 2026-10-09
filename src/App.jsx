import { useEffect, useMemo, useRef, useState } from "react";
import teamPhoto1 from "../team-photo-1.jpeg";
import teamPhoto2 from "../team-photo-2.jpeg";
import teamPhoto3 from "../team-photo-3.jpeg";
import teamPhoto4 from "../team-photo-4.jpeg";

const SHOW_GEOMETRY = true;
const LOGO_URL = "https://www.nerdy.com/nerdy-logo-white.png";

const plateCopy = {
  academy:
    "Panoramic Greek academy in lush Mediterranean gardens. Two contemporary thinkers collaborate at a marble table as a subtle golden geometric visualization emerges between them, with colonnades, a wisdom sculpture and ancient Athens beyond under a bright blue sky.",
  athena:
    "A marble statue of Athena in an olive garden, with a bronze armillary sphere and a faint constellation of mathematical relationships, and Athens behind.",
  newWing:
    "A magnificent marble academy with a new wing taking shape, with fine golden geometric lines tracing the underlying architecture.",
};

const stats = [
  {
    value: 43.3,
    label: "Q2 2026 revenue",
    format: (value) => `$${value.toFixed(1)}M`,
  },
  {
    value: 29.1,
    label: "Active learning memberships as of June 30, 2026",
    format: (value) => `${value.toFixed(1)}K`,
  },
  {
    value: 366,
    label: "Average revenue per member per month, up 5% YoY",
    format: (value) => `$${Math.round(value)}`,
  },
  {
    value: 64.7,
    label: "Gross margin in Q2 2026, up 320 bps YoY",
    format: (value) => `${value.toFixed(1)}%`,
  },
  {
    value: 10,
    label: "Tutoring sessions delivered",
    format: (value) => `${Math.round(value)}M+`,
    accent: true,
  },
];

const principles = [
  {
    numeral: "I",
    title: (
      <>
        AI-native at <em>every</em> level — from day-one hires to the C-suite.
      </>
    ),
    detail:
      "Everyone here builds and ships with generative AI. It's table stakes, not a differentiator — and it's how we move 10× faster than legacy education companies.",
  },
  {
    numeral: "II",
    title: (
      <>
        Move at <em>founder velocity.</em> Prototype in hours, ship in days.
      </>
    ),
    detail:
      "We measure in real user outcomes, not quarterly roadmaps. If you've ever wanted to skip the JIRA ticket and just build the thing — you'll fit right in.",
  },
  {
    numeral: "III",
    title: (
      <>
        Full-stack <em>ownership.</em> You design, build, and run what you ship.
      </>
    ),
    detail:
      "Accountability is a feature of the work — not a ceremony layered on top. The person closest to the problem owns it end-to-end, with the autonomy and tooling to fix it.",
  },
  {
    numeral: "IV",
    title: (
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
    kind: "light",
    span: "span-5",
    eyebrow: "Engineering",
    title: "PRs are co-authored. Reviews are AI-assisted. On-call is augmented.",
    bullets: [
      "Every engineer pairs with Claude Code daily — for design, refactors, and tests.",
      "Internal Live + AI agents triage on-call alerts and draft postmortems.",
      "Eval suites gate every model change before it touches a learner session.",
    ],
  },
  {
    kind: "light",
    span: "span-4",
    eyebrow: "Product",
    title: "Specs become evals before they become tickets.",
    bullets: [
      "Every feature ships with a prompt-and-eval pair, written by the PM.",
      "Discovery research uses AI to synthesize 10× more learner sessions.",
      "Roadmaps are continuous — not quarterly. Decisions get made in days.",
    ],
    stat: { value: "200+", caption: "production evals running in CI right now." },
  },
  {
    kind: "dark",
    span: "span-3",
    eyebrow: "Across the company",
    title: (
      <>
        Every Nerd has <em>agents.</em>
      </>
    ),
    bullets: [
      "Recruiters, ops, finance, legal — everyone has a personal stack of agents.",
      "Internal agent marketplace with 40+ shared, version-controlled agents.",
    ],
  },
  {
    kind: "light",
    span: "span-4",
    eyebrow: "Sales & GTM",
    title: "Reps run a team — of one human and a fleet of agents.",
    bullets: [
      "Live AI listens on every district call to draft tailored proposals.",
      "Pipeline forecasts get AI-rewritten daily from CRM & email signal.",
      "Top reps spend ~70% of their day talking to humans, not data entry.",
    ],
    stat: { value: "3.4×", caption: "deal velocity since enabling agents on the floor." },
  },
  {
    kind: "light",
    span: "span-4",
    eyebrow: "Operations & Support",
    title: "Issues route, escalate, and resolve themselves — until they shouldn't.",
    bullets: [
      "~80% of L1 support tickets resolved without a human touching them.",
      "Humans focus on the hard 20% — and on improving the agents that handle the rest.",
    ],
    stat: {
      value: "Maya,",
      caption:
        "our AI concierge, now handles a meaningful share of in-product customer interactions.",
    },
  },
];

const locationItems = [
  ["Remote-first", "18 countries"],
  ["St. Louis, MO", "HQ"],
  ["New York, NY", "Hub"],
  ["Hyderabad, India", "Hub"],
  ["São Paulo, Brazil", "LATAM"],
  ["Mexico City", "LATAM"],
  ["Buenos Aires", "LATAM"],
  ["London, UK", ""],
  ["Toronto, Canada", ""],
  ["Lisbon, Portugal", ""],
];

const filters = ["All", "Engineering", "Product", "Sales", "Operations"];

function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrolled;
}

function useCountUp(target, format) {
  const [display, setDisplay] = useState(format(0));
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    let raf = 0;
    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const duration = 1400;
        const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(format(target * easeOutCubic(progress)));
          if (progress < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setDisplay(format(target));
          }
        };

        raf = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, format]);

  return { ref, display };
}

function App() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Stats />
        <SectionDivider />
        <Mission />
        <HowWeWork />
        <AiPractice />
        <LocationsMarquee />
        <Team />
        <OpenRoles />
        <CandidatePrep />
        <SectionDivider />
        <BenchCta />
      </main>
      <Footer />
    </>
  );
}

function SiteNav() {
  const scrolled = useNavScrolled();

  return (
    <header className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container nav-inner">
        <a className="nav-brand" href="#top" aria-label="Nerdy Careers home">
          <img src={LOGO_URL} alt="Nerdy" />
          <span className="nav-divider" aria-hidden="true" />
          <span className="nav-title">Careers</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#mission">Our mission</a>
          <a href="#how">How we work</a>
          <a href="#roles">Open roles</a>
          <a href="#resources">Candidate prep</a>
          <a href="https://www.nerdy.com/">Who we are</a>
        </nav>
      </div>
    </header>
  );
}

function Button({ href, variant = "primary", children }) {
  return (
    <a className={`button ${variant}`} href={href}>
      {children}
      {variant === "primary" ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}

function Hero() {
  return (
    <section className="hero section-light" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-content">
        <div className="eyebrow-pill">
          <span className="pulse-dot" aria-hidden="true" />
          <span>Now hiring · Engineering, Product &amp; Sales</span>
        </div>
        <h1>
          The next <em>Renaissance</em> in learning starts here.
        </h1>
        <p className="hero-subhead">
          At Nerdy (NYSE: NRDY), we pair expert instructors with real-time generative AI to
          deliver personalized learning at scale — for every learner, from preschool fundamentals
          to professional mastery.
        </p>
        <div className="hero-actions">
          <Button href="#roles">Explore open roles</Button>
          <Button href="#how" variant="secondary">
            How we work
          </Button>
        </div>
        <div className="hero-plate">
          <PlateFrame
            variant="plate-one"
            aspect="wide"
            alt={plateCopy.academy}
            geometry={<PlateOneGeometry />}
          />
          <PlateCaption
            label="Plate I · The New Academy"
            text="The human is teaching, and the mathematics around them is coming alive."
          />
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="stats-section section-light" aria-label="Company stats">
      <div className="container stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ stat }) {
  const { ref, display } = useCountUp(stat.value, stat.format);

  return (
    <div className="stat-card" ref={ref}>
      <div className={`stat-number ${stat.accent ? "is-accent" : ""}`}>{display}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="section-divider section-light" aria-hidden="true">
      <div className="container divider-inner">
        <span />
        <i />
        <span />
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, lede, dark = false }) {
  return (
    <div className={`section-header ${dark ? "on-dark" : ""}`}>
      <div className="section-eyebrow">{eyebrow}</div>
      <div>
        <h2>{title}</h2>
        {lede ? <p>{lede}</p> : null}
      </div>
    </div>
  );
}

function Mission() {
  return (
    <section className="mission section-light" id="mission">
      <div className="container">
        <SectionHeader
          eyebrow="I · The mission"
          title={
            <>
              Transforming how people learn — for the <em>next 200 years.</em>
            </>
          }
          lede="Classrooms have relied on a one-size-fits-all model for two centuries. That era is giving way to something better. Our Live + AI™ platform makes genuinely personalized learning — at global scale — the new default."
        />
        <div className="mission-grid">
          <div>
            <PlateFrame
              variant="plate-two"
              aspect="portrait"
              alt={plateCopy.athena}
              geometry={<PlateTwoGeometry />}
              lazy
            />
            <PlateCaption label="Plate II · Athena and the geometry of intelligence" />
          </div>
          <article className="quote-card">
            <div className="quote-mark" aria-hidden="true">
              “
            </div>
            <blockquote>
              Artificial intelligence is rewriting education — and its power is greatest when it
              amplifies the human spark at learning&apos;s core. Join us and build that future.
            </blockquote>
            <div className="quote-rule" aria-hidden="true" />
            <div className="quote-author">
              <strong>CHUCK COHN</strong>
              <span>Founder &amp; CEO, Nerdy</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section className="how-section dark-section" id="how">
      <div className="section-glow" aria-hidden="true" />
      <div className="container">
        <SectionHeader
          dark
          eyebrow="II · How we work"
          title={
            <>
              An AI-native, free-market meritocracy moving at <em>founder pace.</em>
            </>
          }
          lede="Four principles shape every team, decision, and hire. They're how we stay accountable to each other — and to our learners."
        />
        <div className="principles">
          {principles.map((principle) => (
            <article className="principle-row" key={principle.numeral}>
              <div className="principle-num">{principle.numeral}</div>
              <h3>{principle.title}</h3>
              <p>{principle.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiPractice() {
  return (
    <section className="ai-section section-light" id="ai-in-the-work">
      <div className="container">
        <SectionHeader
          eyebrow="III · AI, in practice"
          title={
            <>
              It&apos;s not a slogan — it&apos;s how the work <em>actually</em> gets done.
            </>
          }
          lede="&quot;AI-first&quot; gets thrown around a lot. Here's what it concretely looks like across the company on any given Tuesday."
        />
        <div className="ai-grid">
          {aiCards.map((card) => (
            <AiCard key={card.eyebrow} card={card} />
          ))}
          <a className="ai-card ai-card-dark ai-cta span-4" href="#roles">
            <div>
              <div className="card-eyebrow">→ Want in?</div>
              <h3>
                If this sounds like the job description you&apos;ve been waiting for, we&apos;re
                hiring.
              </h3>
            </div>
            <div className="ai-cta-bottom">
              <span>See open roles</span>
              <i aria-hidden="true">→</i>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function AiCard({ card }) {
  return (
    <article
      className={`ai-card ${card.kind === "dark" ? "ai-card-dark" : "ai-card-light"} ${card.span}`}
    >
      <div className="card-eyebrow">{card.eyebrow}</div>
      <h3>{card.title}</h3>
      <ul>
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      {card.stat ? (
        <div className="card-stat">
          <strong>{card.stat.value}</strong>
          <span>{card.stat.caption}</span>
        </div>
      ) : null}
    </article>
  );
}

function LocationsMarquee() {
  const loopItems = [...locationItems, ...locationItems];

  return (
    <section className="locations-marquee dark-section" aria-label="Nerdy locations">
      <div className="marquee-track">
        {loopItems.map(([name, tag], index) => (
          <div className="location-item" key={`${name}-${index}`}>
            <span className="teal-dot" aria-hidden="true" />
            <span>{name}</span>
            {tag ? <em>{tag}</em> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="team section-light">
      <div className="container">
        <SectionHeader
          eyebrow="IV · The team"
          title={
            <>
              Meet the <em>Nerds.</em>
            </>
          }
          lede="A global team of engineers, educators, designers, and operators building the future of learning together."
        />
        <div className="team-gallery">
          <img className="team-wide" src={teamPhoto1} alt="Nerdy team members collaborating" loading="lazy" />
          <img src={teamPhoto2} alt="Nerdy team member portrait" loading="lazy" />
          <img src={teamPhoto3} alt="Nerdy team members in discussion" loading="lazy" />
          <img src={teamPhoto4} alt="Nerdy team gathering" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function OpenRoles() {
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const response = await fetch("/api/jobs", { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error("Unable to load jobs");
        const data = await response.json();
        if (!cancelled) {
          setJobs(Array.isArray(data.jobs) ? data.jobs : []);
          setStatus("ready");
        }
      } catch (error) {
        if (!cancelled) setStatus("error");
      }
    }

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const next = Object.fromEntries(filters.map((filter) => [filter, 0]));
    next.All = jobs.length;
    jobs.forEach((job) => {
      const department = mapDepartment(job.department);
      if (next[department] !== undefined) next[department] += 1;
    });
    return next;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (activeFilter === "All") return jobs;
    return jobs.filter((job) => mapDepartment(job.department) === activeFilter);
  }, [activeFilter, jobs]);

  return (
    <section className="roles-section dark-section" id="roles">
      <div className="container">
        <div className="roles-plate">
          <PlateFrame
            variant="plate-three"
            aspect="ultrawide"
            alt={plateCopy.newWing}
            geometry={<PlateThreeGeometry />}
            lazy
            dark
          />
          <PlateCaption
            dark
            label="Plate III · The new wing"
            text="What an extraordinary place to be, and what an ambitious thing to help build."
          />
        </div>
        <SectionHeader
          dark
          eyebrow="V · Open roles"
          title={
            <>
              Help build the <em>future of learning.</em>
            </>
          }
          lede="We're hiring across Engineering, Product, Sales, and Operations — remote, global, and built for builders. Whether you're closing deals, keeping systems running, or shipping code — the same principles apply here. We move fast, reward contribution, and hold ourselves accountable to learners, not process. Every role at Nerdy is a front-row seat to one of the most consequential shifts in education."
        />
        <div className="role-filters" aria-label="Filter open roles">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? "active" : ""}
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
            >
              {filter} <span>{counts[filter]}</span>
            </button>
          ))}
        </div>
        <div className="job-list">
          {status === "loading" ? <p className="role-state">Loading open roles…</p> : null}
          {status === "error" ? (
            <p className="role-state">Unable to load roles. Please visit careers.nerdy.com/jobs.</p>
          ) : null}
          {status === "ready" && filteredJobs.length === 0 ? (
            <p className="role-state">No roles match this filter right now.</p>
          ) : null}
          {status === "ready"
            ? filteredJobs.map((job) => <JobRow job={job} key={`${job.title}-${job.applyUrl}`} />)
            : null}
        </div>
        <div className="roles-footer">
          <span>
            Showing {filteredJobs.length} of {jobs.length} roles.
          </span>
          <a href="https://careers.nerdy.com/jobs" target="_blank" rel="noreferrer">
            View all roles on careers.nerdy.com <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function JobRow({ job }) {
  const postedDays = getPostedDays(job.postedDate);
  const department = mapDepartment(job.department);
  const isNew = postedDays !== null && postedDays <= 7;
  const hook = job.hook && job.hook.length > 120 ? `${job.hook.slice(0, 117)}...` : job.hook;

  return (
    <a className="job-row" href={job.applyUrl} target="_blank" rel="noreferrer">
      <div className="job-title-block">
        <h3>
          {job.title}
          {isNew ? <span>NEW</span> : null}
        </h3>
        <p>
          {[department, job.team, job.type].filter(Boolean).join(" · ")}
          {hook ? <small>{hook}</small> : null}
        </p>
      </div>
      <div className="posted-date">
        {postedDays === null ? "Posted recently" : `Posted ${postedDays} days ago`}
      </div>
      <div>{department}</div>
      <div className="job-location">
        <span className="teal-dot" aria-hidden="true" />
        {job.location || "Remote"}
      </div>
      <div className="job-arrow" aria-hidden="true">
        →
      </div>
    </a>
  );
}

function CandidatePrep() {
  return (
    <section className="candidate-section section-light" id="resources">
      <div className="container">
        <SectionHeader
          eyebrow="VI · Candidate prep"
          title="Everything you need to ace your interviews."
          lede="Great candidate experiences start with transparency. Read up on how we hire, what we look for, and what it's actually like to work here — before you even apply."
        />
        <div className="resource-grid">
          <ResourceCard
            dark
            tag="Candidate guide"
            title="Nerdy by Nature: a candidate's guide to our hiring process."
            body="Walk through our end-to-end interview process, get resume tips, and read our policies — including how (and when) to use AI during your interview."
            cta="Read the guide"
            href="/nerdy-by-nature"
          />
          <ResourceCard
            tag="A note from the team"
            title="AI at Nerdy."
            body='A short, candid look at what "AI-first" actually means in practice — for the engineers shipping product, the learning scientists shaping curriculum, the operators running the business, and everyone in between.'
            cta="Read the article"
            href="/ai-at-nerdy"
          />
          <ResourceCard
            tag="Day in the life"
            title="A day in the life of an AI-Native Engineer at Nerdy."
            body="What it actually looks like to build on Live + AI — how our engineers work, ship, and use AI as a force multiplier."
            cta="Read the article"
            href="/day-in-the-life"
          />
        </div>
      </div>
    </section>
  );
}

function ResourceCard({ dark = false, tag, title, body, cta, href }) {
  return (
    <a className={`resource-card ${dark ? "resource-dark" : ""}`} href={href}>
      <span className="resource-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <span className="resource-link">
        {cta} <i aria-hidden="true">→</i>
      </span>
    </a>
  );
}

function BenchCta() {
  const [message, setMessage] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  async function submitBench(event) {
    event.preventDefault();
    setState("submitting");
    setError("");

    try {
      const response = await fetch("/api/bench-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Unable to send right now. Please try again shortly.");
      }

      setState("success");
    } catch (submitError) {
      setError(submitError.message);
      setState("idle");
    }
  }

  return (
    <section className="bench-section section-light">
      <div className="bench-glow" aria-hidden="true" />
      <div className="container bench-content">
        <h2>
          Product Engineer? <em>AI-native builder?</em> Show us what you&apos;ve made.
        </h2>
        <p>
          We&apos;re always looking for great talent — no open role required. Send us something
          you&apos;ve built: a project, a prototype, a tool, a side quest. Every submission gets a
          personal review from recruiting and engineering leaders. We&apos;re building our bench for
          what&apos;s next.
        </p>
        <div className="bench-card">
          {state === "success" ? (
            <div className="success-state">
              <h3>Thanks — we got it.</h3>
              <p>
                A real human on our recruiting or engineering team will personally review your
                work.
              </p>
            </div>
          ) : (
            <form onSubmit={submitBench}>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hi Nerdy — here's something I built. It does X, learns from Y, and was made with Z. Here's why I'd be a great fit for the Product Engineering bench…"
                required
                minLength={20}
              />
              <div className="bench-hint">
                <span className="pulse-dot" aria-hidden="true" />
                <span>Reviewed by recruiting &amp; engineering leaders · careers@nerdy.com</span>
              </div>
              {error ? <p className="form-error">{error}</p> : null}
              <button className="button primary" type="submit" disabled={state === "submitting"}>
                {state === "submitting" ? "Sending" : "Send"} <span aria-hidden="true">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <img src={LOGO_URL} alt="Nerdy" />
          <p>
            Nerdy is the parent company of Varsity Tutors — a leading platform for live,
            AI-powered learning.
          </p>
        </div>
        <div>
          <h2>Company</h2>
          <a href="https://www.nerdy.com/about">About Nerdy</a>
          <a href="https://www.varsitytutors.com/">Varsity Tutors</a>
          <a href="https://investors.nerdy.com/overview/default.aspx">Investor relations</a>
          <a href="https://investors.nerdy.com/news/default.aspx">Press</a>
        </div>
        <div>
          <h2>Legal</h2>
          <a href="https://www.varsitytutors.com/privacy">Privacy policy</a>
          <a href="https://www.varsitytutors.com/terms">Terms of use</a>
          <a href="https://www.varsitytutors.com/accessibility">Accessibility</a>
          <a href="/candidate-privacy">Candidate privacy</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Nerdy Inc. All rights reserved.</span>
        <span className="stock-chip">NYSE: NRDY</span>
      </div>
    </footer>
  );
}

function PlateFrame({ aspect, alt, geometry, lazy = false, dark = false, variant }) {
  return (
    <figure className={`plate-frame ${aspect} ${dark ? "on-dark" : ""}`}>
      {/* TODO: Replace this placeholder with the provided final art file for this slot. */}
      <div className={`plate-placeholder ${variant}`} role="img" aria-label={alt}>
        <span>{alt}</span>
      </div>
      {SHOW_GEOMETRY ? geometry : null}
      {lazy ? <span className="sr-only">Lazy-loaded plate placeholder</span> : null}
    </figure>
  );
}

function PlateCaption({ label, text, dark = false }) {
  return (
    <div className={`plate-caption ${dark ? "on-dark" : ""}`}>
      <span>{label}</span>
      {text ? <em>&quot;{text}&quot;</em> : null}
    </div>
  );
}

function PlateOneGeometry() {
  return (
    <svg className="geometry-overlay" viewBox="0 0 2100 900" preserveAspectRatio="xMidYMid slice">
      <circle cx="1380" cy="450" r="360" />
      <circle cx="1380" cy="450" r="222" />
      <circle cx="1602" cy="450" r="137" />
      <rect x="1020" y="90" width="720" height="720" />
      <line x1="1020" y1="90" x2="1740" y2="810" />
      <line x1="1740" y1="90" x2="1020" y2="810" />
      <line className="dashed" x1="1380" y1="0" x2="1380" y2="900" />
      <circle className="gold-dot" cx="1380" cy="450" r="5" />
      <circle className="gold-dot" cx="1602" cy="450" r="4" />
      <circle className="gold-dot" cx="1380" cy="90" r="3.5" />
    </svg>
  );
}

function PlateTwoGeometry() {
  return (
    <svg className="geometry-overlay" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice">
      <circle cx="400" cy="380" r="250" />
      <ellipse cx="400" cy="380" rx="250" ry="80" />
      <ellipse cx="400" cy="380" rx="80" ry="250" />
      <line x1="0" y1="380" x2="800" y2="380" />
      <circle className="gold-dot" cx="400" cy="380" r="5" />
      <circle className="gold-dot" cx="650" cy="380" r="4" />
    </svg>
  );
}

function PlateThreeGeometry() {
  return (
    <svg className="geometry-overlay" viewBox="0 0 2100 800" preserveAspectRatio="xMidYMid slice">
      <path d="M180 590 L510 230 L880 590 L1250 230 L1630 590 L1940 260" />
      <path d="M330 660 L760 160 L1190 660 L1620 160 L1960 660" />
      <line x1="160" y1="610" x2="1960" y2="610" />
      <line x1="510" y1="230" x2="510" y2="690" />
      <line x1="1250" y1="230" x2="1250" y2="690" />
      <circle className="gold-dot" cx="510" cy="230" r="4" />
      <circle className="gold-dot" cx="1250" cy="230" r="4" />
      <circle className="gold-dot" cx="1630" cy="590" r="3.5" />
    </svg>
  );
}

function mapDepartment(department = "") {
  const value = department.toLowerCase();
  if (value.includes("engineer") || value.includes("technology")) return "Engineering";
  if (value.includes("product")) return "Product";
  if (value.includes("sales") || value.includes("gtm") || value.includes("marketing")) return "Sales";
  if (value.includes("operation") || value.includes("support") || value.includes("customer")) {
    return "Operations";
  }
  return department && filters.includes(department) ? department : "Operations";
}

function getPostedDays(postedDate) {
  if (!postedDate) return null;
  const posted = new Date(postedDate);
  if (Number.isNaN(posted.getTime())) return null;
  const diff = Date.now() - posted.getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

export default App;
