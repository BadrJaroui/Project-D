

import { serialize, parse } from 'cookie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(res, token) {
  const cookie = serialize('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
    sameSite: 'Lax',
  });

  return cookie;
}

export function clearAuthCookie() {
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: -1,
    path: '/',
    sameSite: 'Lax',
  });
  return cookie;
}

export function getAuthTokenFromRequest(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return null;
  }
  const cookies = parse(cookieHeader);
  return cookies.authToken || null;
}
