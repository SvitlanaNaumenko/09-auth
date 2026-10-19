import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перевіряємо саме accessToken, який присилає сервер
  const accessToken = request.cookies.get('accessToken');

  const isPrivateKey = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some(route => pathname.startsWith(route));

  // Якщо користувач НЕ авторизований і намагається відкрити приватний маршрут
  if (isPrivateKey && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Якщо користувач АВТОРИЗОВАНИЙ і намагається відкрити сторінку входу/реєстрації
  if (isPublicKey && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
