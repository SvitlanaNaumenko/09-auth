import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;
  const isPrivateKey = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some(route => pathname.startsWith(route));

  let hasValidSession = Boolean(accessToken);
  let updatedResponse: NextResponse | null = null;

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      if (response) {
        hasValidSession = true;
        updatedResponse = NextResponse.next();

        // Переносимо нові куки з відповіді checkSession у поточний запит/відповідь
        const setCookieHeader = response.headers?.['set-cookie'];
        if (setCookieHeader) {
          if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach(cookie => {
              updatedResponse?.headers.append('set-cookie', cookie);
            });
          } else {
            updatedResponse.headers.set('set-cookie', setCookieHeader);
          }
        }
      }
    } catch {
      hasValidSession = false;
    }
  }

  if (isPrivateKey && !hasValidSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && hasValidSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return updatedResponse || NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
