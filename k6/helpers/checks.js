export const status2xx = (r) => r.status >= 200 && r.status < 300;
export const ttfbUnder = (ms) => ({ name: `TTFB < ${ms}ms`, fn: (r) => r.timings.waiting < ms });
export const latencyUnder = (ms) => ({ name: `Latency < ${ms}ms`, fn: (r) => r.timings.duration < ms });
export const bodyNotEmpty = { name: 'body not empty', fn: (r) => (r.body || '').length > 0 };
export const jsonOk = { name: 'valid JSON', fn: (r) => { try { JSON.parse(r.body); return true; } catch { return false; } } };
export const headerPresent = (header) => ({ name: `header ${header} present`, fn: (r) => r.headers[header] !== undefined });