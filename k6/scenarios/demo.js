import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { ENDPOINTS, API_TOKEN, getRandomWord } from '../helpers/data.js';
import { sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// DEMO TEST: Visual, quick demonstration of all scenarios combined
// Perfect for: presentations, showing realistic user patterns
export const options = {
  ...commonOptions,
  scenarios: {
    // Phase 1: Normal usage (30s)
    normal_users: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      startTime: '0s',
      tags: { phase: 'normal' },
    },
    // Phase 2: Growing popularity (30s)
    growing_traffic: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '15s', target: 20 },
        { duration: '15s', target: 25 },
      ],
      startTime: '30s',
      tags: { phase: 'growth' },
    },
    // Phase 3: Sudden spike (20s)
    traffic_spike: {
      executor: 'ramping-vus',
      startVUs: 25,
      stages: [
        { duration: '5s', target: 40 },
        { duration: '10s', target: 40 },
        { duration: '5s', target: 25 },
      ],
      startTime: '1m',
      tags: { phase: 'spike' },
    },
    // Phase 4: Recovery and steady state (30s)
    steady_state: {
      executor: 'ramping-vus',
      startVUs: 25,
      stages: [
        { duration: '15s', target: 15 },
        { duration: '15s', target: 15 },
      ],
      startTime: '1m20s',
      tags: { phase: 'steady' },
    },
  },
};

let iterationCount = 0;

export default function () {
  iterationCount++;
  const slug = getRandomWord();
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}`, word: slug };

  // Log every 50th request for demo visibility
  if (iterationCount % 50 === 0) {
    console.log(`[Demo] VU ${__VU}: Searching for "${slug}" (iteration ${iterationCount})`);
  }

  const res = get(ENDPOINTS.signBySlug(slug), params);
  record(res);
  
  // Realistic user behavior with varied think time
  const thinkTime = Math.random() * 2 + 0.5; // 0.5-2.5 seconds
  sleep(thinkTime);
}

// Generate beautiful HTML report for demo
export function handleSummary(data) {
  return {
    'demo-summary.html': htmlReport(data),
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
  };
}
