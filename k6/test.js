import http from 'k6/http';
import { check, sleep } from 'k6';


export const options = {
    vus: 10,
    iterations: '40',
    cloud: {
    // Project: Default project
    projectID: 4889203,
    // Test runs with the same name groups test runs together.
    name: 'Test run Demo'
  }
};



const baseUrl = 'https://api.inclutec.org';

const apiToken = 'API_TOKEN_HERE';

const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
}

export default () => {
    const res = http.get(`${baseUrl}/signs/ahorrar`, { headers });
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    sleep(1);
}