import { Trend, Rate, Counter } from 'k6/metrics';

export const apiLatency = new Trend('api_latency');         // total duration per request
export const apiTTFB = new Trend('api_ttfb');               // waiting time
export const apiErrors = new Rate('api_errors');            // non-2xx
export const reqCount = new Counter('api_requests');

export function record(res) {
  reqCount.add(1, res.tags);
  apiLatency.add(res.timings.duration, res.tags);
  apiTTFB.add(res.timings.waiting, res.tags);
  apiErrors.add(!(res.status >= 200 && res.status < 300), res.tags);
}
