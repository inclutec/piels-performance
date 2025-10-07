export const BASE_URL = 'https://api.inclutec.org';
export const API_TOKEN = 'token_here'; // Replace with your actual API token

// Endpoint paths
export const ENDPOINTS = {
    signBySlug: (slug) => `${BASE_URL}/signs/${slug}`,
    allSigns: `${BASE_URL}/signs`,
    health: `${BASE_URL}/health`,
};