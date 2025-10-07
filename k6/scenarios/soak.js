import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { ENDPOINTS, API_TOKEN } from '../helpers/data.js';
import { sleep } from 'k6';

export const options = {
  ...commonOptions,
  scenarios: {
    soak: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.RATE || 5),
      timeUnit: '1s',
      duration: '30m',
      preAllocatedVUs: Number(20),
      maxVUs: Number(100),
      tags: { scenario: 'soak' },
    },
  },
};

export default function () {
  const slug = 'ahorrar';
  const params = authHeaders(API_TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(ENDPOINTS.signBySlug(slug), params);
  record(res);
  sleep(0.5); // pace out requests
}
