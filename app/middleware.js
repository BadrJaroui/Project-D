import { NextResponse } from 'next/server';
import { verifyToken, getAuthTokenFromRequest } from './utils/Auth';

const publicPaths = ['/', '/loginPage', '/api/login', '/api/logout', '/api/check-auth', '/_next/static', '/favicon.ico', '/NDWLogo.svg'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const authToken = getAuthTokenFromRequest(request);

  if (!authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/loginPage';
    return NextResponse.redirect(url);
  }

  const decoded = verifyToken(authToken);

  if (!decoded) {
    const url = request.nextUrl.clone();
    url.pathname = '/loginPage';
    const response = NextResponse.redirect(url);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
