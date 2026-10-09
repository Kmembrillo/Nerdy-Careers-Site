const departmentMap = {
  engineering: "Engineering",
  technology: "Engineering",
  product: "Product",
  sales: "Sales",
  gtm: "Sales",
  marketing: "Sales",
  operations: "Operations",
  support: "Operations",
  customer: "Operations",
};

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
};

export const handler = async () => {
  try {
    const jobs = await loadJobs();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ jobs }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Unable to load roles." }),
    };
  }
};

async function loadJobs() {
  if (process.env.ASHBY_API_KEY && process.env.ASHBY_BOARD_ID) {
    return fetchAshbyJobs(process.env.ASHBY_BOARD_ID, process.env.ASHBY_API_KEY);
  }

  if (process.env.GREENHOUSE_BOARD_TOKEN) {
    return fetchGreenhouseJobs(process.env.GREENHOUSE_BOARD_TOKEN);
  }

  if (process.env.LEVER_COMPANY) {
    return fetchLeverJobs(process.env.LEVER_COMPANY);
  }

  return [];
}

async function fetchGreenhouseJobs(boardToken) {
  const response = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`,
  );
  if (!response.ok) throw new Error(`Greenhouse jobs failed: ${response.status}`);
  const data = await response.json();

  return (data.jobs || []).map((job) => {
    const department = job.departments?.[0]?.name || "";
    const location = job.location?.name || "Remote";

    return normalizeJob({
      title: job.title,
      department,
      team: job.offices?.[0]?.name || department,
      type: "Full-time",
      location,
      hook: stripHtml(job.content || "").slice(0, 180),
      applyUrl: job.absolute_url,
      postedDate: job.updated_at || job.created_at,
    });
  });
}

async function fetchLeverJobs(company) {
  const response = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
  if (!response.ok) throw new Error(`Lever jobs failed: ${response.status}`);
  const data = await response.json();

  return (data || []).map((job) => {
    const department = job.categories?.department || "";

    return normalizeJob({
      title: job.text,
      department,
      team: job.categories?.team || department,
      type: job.categories?.commitment || "Full-time",
      location: job.categories?.location || "Remote",
      hook: stripHtml(job.descriptionPlain || job.description || ""),
      applyUrl: job.hostedUrl,
      postedDate: job.createdAt ? new Date(job.createdAt).toISOString() : "",
    });
  });
}

async function fetchAshbyJobs(boardId, apiKey) {
  const response = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${boardId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
    },
  });
  if (!response.ok) throw new Error(`Ashby jobs failed: ${response.status}`);
  const data = await response.json();

  return (data.jobs || []).map((job) => {
    const department = job.department || "";

    return normalizeJob({
      title: job.title,
      department,
      team: job.team || department,
      type: job.employmentType || "Full-time",
      location: job.locationName || "Remote",
      hook: stripHtml(job.descriptionHtml || job.descriptionPlain || ""),
      applyUrl: job.applyUrl || job.jobUrl,
      postedDate: job.publishedAt || job.updatedAt,
    });
  });
}

function normalizeJob(job) {
  const department = normalizeDepartment(job.department);

  return {
    title: job.title || "Open role",
    department,
    team: job.team || department,
    type: job.type || "Full-time",
    location: job.location || "Remote",
    hook: String(job.hook || "").trim(),
    applyUrl: job.applyUrl || "https://careers.nerdy.com/jobs",
    postedDate: job.postedDate || "",
  };
}

function normalizeDepartment(department) {
  const raw = String(department || "").trim();
  const lower = raw.toLowerCase();
  const match = Object.entries(departmentMap).find(([key]) => lower.includes(key));
  return match ? match[1] : raw || "Operations";
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
