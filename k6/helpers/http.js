import http from 'k6/http';
import { check } from 'k6';
import { status2xx } from './checks.js';

export function authHeaders(API_TOKEN) {
  return {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    // tag requests so thresholds can target {kind:api, endpoint:...}
    tags: { kind: 'api' },
  };
}

/** GET with default checks; pass extraChecks=[] to add more */
export function get(url, params, extraChecks = []) {
  const res = http.get(url, params);
  const base = { 'status is 2xx': (r) => status2xx(r) };
  const extras = extraChecks.reduce((acc, c) => ({ ...acc, [c.name]: (r) => c.fn(r) }), {});
  check(res, { ...base, ...extras });
  return res;
}