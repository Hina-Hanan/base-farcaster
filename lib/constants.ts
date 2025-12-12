export const MESSAGE_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 day

// Support Vercel automatic URL detection
// Priority: NEXT_PUBLIC_URL > VERCEL_URL > NEXT_PUBLIC_VERCEL_URL > localhost
function getAppUrl(): string {
  // Explicitly set URL
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  
  // Vercel automatic URL (available at build and runtime)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Alternative Vercel URL env var
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return process.env.NEXT_PUBLIC_VERCEL_URL;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:3000';
}

const APP_URL: string = getAppUrl();

// Validate URL format (only warn in development, don't throw)
if (!APP_URL || (!APP_URL.startsWith('http://') && !APP_URL.startsWith('https://'))) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ APP_URL is not a valid HTTP/HTTPS URL:', APP_URL);
  }
}

export { APP_URL };
