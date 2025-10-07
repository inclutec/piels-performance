import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { endpoints, TOKEN } from '../helpers/data.js';

export const options = {
  ...commonOptions,
  scenarios: {
    stress: {
      executor: 'ramping-arrival-rate',
      timeUnit: '1s',
      preAllocatedVUs: Number(100),
      maxVUs: Number(200),
      stages: [
        { target: 20,  duration: '1m' },
        { target: 50,  duration: '2m' },
        { target: 100, duration: '2m' },
        { target: 200, duration: '2m' },
        { target: 0,   duration: '1m' },
      ],
      tags: { scenario: 'stress' },
    },
  },
};

export default function () {
  const slug = 'ahorrar';
  const params = authHeaders(TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(endpoints.signBySlug(slug), params);
  record(res);
}
