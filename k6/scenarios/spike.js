import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { record } from '../helpers/metrics.js';
import { endpoints, TOKEN } from '../helpers/data.js';

export const options = {
  ...commonOptions,
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      timeUnit: '1s',
      preAllocatedVUs: Number(100),
      maxVUs: Number(150),
      stages: [
        { target: 5,  duration: '10s' },  // baseline
        { target: 100, duration: '10s' }, // spike
        { target: 5,  duration: '30s' },  // recover
      ],
      tags: { scenario: 'spike' },
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
