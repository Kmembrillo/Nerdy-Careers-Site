const day = 24 * 60 * 60 * 1000;

const roles = [
  {
    title: "Staff Software Engineer, AI-Native",
    department: "Engineering",
    team: "Live + AI",
    type: "Full-time",
    location: "Remote · Global",
    hook:
      "Own the planning loop behind every Live + AI session — the brain that decides what the tutor and the model do next.",
    applyUrl: "https://careers.nerdy.com/job-posts/stafffe",
    postedDaysAgo: 3,
  },
  {
    title: "Senior Software Engineer, AI-Native",
    department: "Engineering",
    team: "Realtime Platform",
    type: "Full-time",
    location: "Remote · LATAM",
    hook:
      "Ship the realtime tutoring agent — voice, vision, and a multi-model orchestration layer that runs in <200ms.",
    applyUrl: "https://careers.nerdy.com/job-posts/sde",
    postedDaysAgo: 6,
  },
  {
    title: "Senior Software Engineer, Evals",
    department: "Engineering",
    team: "Model Quality",
    type: "Full-time",
    location: "Hyderabad, India",
    hook:
      "Build the eval-and-deploy harness every model change passes through before it touches a learner.",
    applyUrl: "https://careers.nerdy.com/job-posts/sde-c7cmb",
    postedDaysAgo: 1,
  },
  {
    title: "Product Engineer, Learner Experience",
    department: "Engineering",
    team: "Learner",
    type: "Full-time",
    location: "Remote · US",
    hook:
      "Prototype, measure, and ship the AI-powered surfaces learners use to make progress every week.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 10,
  },
  {
    title: "Senior Product Manager, Live + AI",
    department: "Product",
    team: "Live + AI",
    type: "Full-time",
    location: "Remote · US",
    hook:
      "Own the surface millions of learners touch every week — from prompt-and-eval design to live A/B tests with measurable outcomes.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 14,
  },
  {
    title: "Product Manager, Agent Marketplace",
    department: "Product",
    team: "Internal AI",
    type: "Full-time",
    location: "New York, NY · Hub",
    hook:
      "Turn every high-leverage workflow into reusable agents that help Nerds move faster across the company.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 4,
  },
  {
    title: "Educational Sales Representative",
    department: "Sales",
    team: "District Partnerships",
    type: "Full-time",
    location: "Remote · US",
    hook:
      "Close districts and universities with a fleet of agents at your back — top reps clear $300K OTE in year one.",
    applyUrl: "https://careers.nerdy.com/job-posts/sales-rep",
    postedDaysAgo: 8,
  },
  {
    title: "Account Executive, Higher Education",
    department: "Sales",
    team: "GTM",
    type: "Full-time",
    location: "Remote · US",
    hook:
      "Bring Live + AI learning to institutions ready to give every student personal support at scale.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 2,
  },
  {
    title: "Sales Operations Analyst",
    department: "Sales",
    team: "Revenue Operations",
    type: "Full-time",
    location: "St. Louis, MO · HQ",
    hook:
      "Build the dashboards, automations, and agent workflows that keep the GTM floor moving at founder pace.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 18,
  },
  {
    title: "IT Operations Specialist",
    department: "Operations",
    team: "Internal Systems",
    type: "Full-time",
    location: "Remote · US",
    hook:
      "Run the agent-augmented helpdesk — where ~80% of tickets resolve before a human reads them.",
    applyUrl: "https://careers.nerdy.com/job-posts/it-operations-specialist",
    postedDaysAgo: 5,
  },
  {
    title: "Customer Operations Lead",
    department: "Operations",
    team: "Support",
    type: "Full-time",
    location: "Remote · Global",
    hook:
      "Own the human escalation layer for Maya and the support agents handling learner questions in real time.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 20,
  },
  {
    title: "Learning Operations Manager",
    department: "Operations",
    team: "Learning Delivery",
    type: "Full-time",
    location: "Remote · LATAM",
    hook:
      "Make tutoring quality measurable, agent-assisted, and continuously better across every learner session.",
    applyUrl: "https://careers.nerdy.com/jobs",
    postedDaysAgo: 6,
  },
];

export async function GET() {
  const now = Date.now();
  const jobs = roles.map(({ postedDaysAgo, ...role }) => ({
    ...role,
    description: role.hook,
    postedDate: new Date(now - postedDaysAgo * day).toISOString(),
  }));

  return Response.json(jobs, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
