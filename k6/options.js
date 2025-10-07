export const commonOptions = {
  thresholds: {
    http_req_failed: ['rate<0.01'],                   // <1% errors overall
    http_req_duration: ['p(95)<1200', 'p(99)<2000'],  // generic guardrail
    'api_latency{kind:api}': ['p(95)<800'],           // API p95 latency
    'api_ttfb{kind:api}': ['p(95)<400'],              // API p95 TTFB
  },
  insecureSkipTLSVerify: false,
};
