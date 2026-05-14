const FEED_BASE_URL = 'https://recruiting.paylocity.com/recruiting/v2/api/feed/jobs/';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const feedUrl = paylocityFeedUrl(process.env.PAYLOCITY_FEED_GUID);
  if (!feedUrl) {
    return json(500, { error: 'Missing PAYLOCITY_FEED_GUID' });
  }

  try {
    const response = await fetch(feedUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Paylocity feed returned ' + response.status);
    }

    const payload = await response.json();
    const rawJobs = extractJobs(payload);
    const jobs = rawJobs.map(normalizeJob).filter((job) => job.title && job.applyUrl);

    return json(200, {
      jobs,
      count: jobs.length,
      fetchedAt: new Date().toISOString(),
    }, { 'Cache-Control': 'public, max-age=300' });
  } catch (error) {
    return json(502, {
      error: 'Unable to fetch jobs',
      detail: error.message,
    });
  }
};

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...corsHeaders, ...extraHeaders },
    body: JSON.stringify(body),
  };
}

function paylocityFeedUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return FEED_BASE_URL + encodeURIComponent(trimmed);
}

function extractJobs(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.jobs)) return payload.jobs;
  if (Array.isArray(payload?.Jobs)) return payload.Jobs;
  if (Array.isArray(payload?.data?.jobs)) return payload.data.jobs;
  return [];
}

function normalizeJob(raw) {
  const title = pick(raw, ['title', 'jobTitle', 'name', 'positionTitle']);
  const department = normalizeDepartment(pick(raw, ['department', 'departmentName', 'jobCategory', 'category', 'team']));
  const team = pick(raw, ['team', 'jobFamily', 'departmentName', 'category']) || department;
  const type = pick(raw, ['type', 'employmentType', 'positionType', 'jobType']) || 'Full-time';
  const postedDate = pick(raw, ['postedDate', 'datePosted', 'createdDate', 'createDate', 'postingDate', 'publishedDate']);
  const applyUrl = pick(raw, ['applyUrl', 'applyURL', 'applicationUrl', 'applicationURL', 'jobUrl', 'jobURL', 'url', 'link']) || nested(raw, ['links', 'apply']) || nested(raw, ['links', 'self']) || '#';
  const description = pick(raw, ['description', 'jobDescription', 'descriptionHtml', 'summary', 'overview']);

  return {
    id: String(pick(raw, ['id', 'jobId', 'positionId', 'requisitionId']) || title || applyUrl),
    title: title || 'Open role',
    department,
    team,
    type,
    location: normalizeLocation(raw),
    hook: truncate(stripHtml(description), 120),
    applyUrl,
    postedDate: postedDate || null,
    isNew: isWithinDays(postedDate, 7),
  };
}

function pick(source, keys) {
  for (const key of keys) {
    const value = source?.[key] ?? source?.[capitalize(key)];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}

function nested(source, path) {
  let value = source;
  for (const key of path) value = value?.[key];
  return value ? String(value).trim() : '';
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeDepartment(value) {
  const text = String(value || '').trim();
  const lower = text.toLowerCase();
  if (lower.includes('engineer') || lower.includes('technology')) return 'Engineering';
  if (lower.includes('product')) return 'Product';
  if (lower.includes('sales') || lower.includes('business development') || lower.includes('gtm')) return 'Sales';
  if (lower.includes('operation') || lower.includes('support') || lower.includes('it')) return 'Operations';
  return text || 'Operations';
}

function normalizeLocation(raw) {
  const city = pick(raw, ['city']) || nested(raw, ['location', 'city']);
  const state = pick(raw, ['state', 'stateCode']) || nested(raw, ['location', 'state']) || nested(raw, ['location', 'stateCode']);
  if (city && state) return city + ', ' + state;
  if (city) return city;
  return pick(raw, ['locationDisplayName', 'locationName', 'location', 'workplaceType']) || nested(raw, ['location', 'displayName']) || 'Remote';
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength) {
  const text = String(value || '').trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function isWithinDays(value, days) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const age = Date.now() - date.getTime();
  return age >= 0 && age < days * 24 * 60 * 60 * 1000;
}
