import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { API_TOKEN, ENDPOINTS, getRandomWord } from '../helpers/data.js';
import { sleep } from 'k6';

export const options = {
  ...commonOptions,
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 5 },    // warm up
        { duration: '1m',  target: 10 },   // baseline
        { duration: '1m',  target: 20 },   // normal load
        { duration: '1m',  target: 30 },   // above normal
        { duration: '1m',  target: 40 },   // stress point
        { duration: '30s', target: 50 },   // breaking point
        { duration: '30s', target: 0 },    // cool down
      ],
      gracefulRampDown: '30s',
      tags: { scenario: 'stress' },
    },
  },
};

export default function () {
  const slug = getRandomWord();
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(ENDPOINTS.signBySlug(slug), params);
  record(res);
  
  // Variable think time based on load
  sleep(Math.random() * 1.5 + 0.5); // 0.5-2 seconds
}
