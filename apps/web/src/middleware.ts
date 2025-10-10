export { auth as middleware } from '@/lib/auth';

// Protect these routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};