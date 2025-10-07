import { commonOptions } from '../options.js';
import { get, authHeaders } from '../helpers/http.js';
import { ttfbUnder, latencyUnder } from '../helpers/checks.js';
import { record } from '../helpers/metrics.js';
import { endpoints, TOKEN } from '../helpers/data.js';

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
  const slug = 'ahorrar';
  const params = authHeaders(TOKEN);
  params.tags = { ...params.tags, endpoint: `signs:${slug}` };

  const res = get(endpoints.signBySlug(slug), params, [ttfbUnder(400), latencyUnder(800)]);
  record(res);
}
