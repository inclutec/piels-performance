import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { ENDPOINTS, API_TOKEN, getRandomWord } from '../helpers/data.js';
import { sleep } from 'k6';

export const options = {
  ...commonOptions,
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },   // normal baseline
        { duration: '15s', target: 40 },   // sudden spike!
        { duration: '30s', target: 40 },   // sustained peak
        { duration: '15s', target: 10 },   // quick recovery
        { duration: '30s', target: 10 },   // back to normal
        { duration: '15s', target: 0 },    // cool down
      ],
      gracefulRampDown: '10s',
      tags: { scenario: 'spike' },
    },
  },
};

export default function () {
  const slug = getRandomWord();
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(ENDPOINTS.signBySlug(slug), params);
  record(res);
  
  // Shorter think time during spike (users acting urgently)
  sleep(Math.random() * 1 + 0.3); // 0.3-1.3 seconds
}
