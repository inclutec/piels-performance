import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { ENDPOINTS, API_TOKEN, getRandomWord } from '../helpers/data.js';
import { sleep } from 'k6';

export const options = {
  ...commonOptions,
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: Number(15),           // sustained 15 concurrent users
      duration: '10m',      // 10 min for demo (normally 30m-2h)
      tags: { scenario: 'soak' },
    },
  },
};

export default function () {
  const slug = getRandomWord();
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(ENDPOINTS.signBySlug(slug), params);
  record(res);
  
  // Realistic user pacing for long-term test
  sleep(Math.random() * 3 + 1); // 1-4 seconds between requests
}
