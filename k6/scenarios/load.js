import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { ttfbUnder, latencyUnder } from '../helpers/checks.js';
import { record } from '../helpers/metrics.js';
import { ENDPOINTS, API_TOKEN, getRandomWord } from '../helpers/data.js';
import { sleep } from 'k6';

export const options = {
  ...commonOptions,
  scenarios: {
    steady_load: {
      executor: 'constant-arrival-rate',
      rate: Number(20), // iterations per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: Number(50),
      maxVUs: Number(100),
      tags: { scenario: 'load' },
    },
  },
};

export default function () {
  const slug = getRandomWord();
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  // Simulate realistic user behavior
  const res = get(ENDPOINTS.signBySlug(slug), params, [ttfbUnder(400), latencyUnder(800)]);
  record(res);
  
  // Think time: users don't immediately make another request
  sleep(Math.random() * 2 + 1); // 1-3 seconds between requests
}
