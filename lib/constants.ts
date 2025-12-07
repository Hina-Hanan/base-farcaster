export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 day

// Support Vercel automatic URL detection
const APP_URL: string = 
  process.env.NEXT_PUBLIC_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  'http://localhost:3000';

// Validate URL format
if (!APP_URL || (!APP_URL.startsWith('http://') && !APP_URL.startsWith('https://'))) {
  throw new Error('APP_URL must be a valid HTTP/HTTPS URL');
}

export { APP_URL };
