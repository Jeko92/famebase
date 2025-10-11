export { auth as middleware } from '@/lib/auth';

// Protect these routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};

// Use Node.js runtime instead of Edge to avoid 1MB size limit
export const runtime = 'nodejs';