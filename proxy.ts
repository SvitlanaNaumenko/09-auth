import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

const isRouteMatch = (pathname: string, routes: string[]) => {
  return routes.some(route => pathname === route || pathname.startsWith(`${route}/`));
};

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;
  const isPrivateKey = isRouteMatch(pathname, privateRoutes);
  const isPublicKey = isRouteMatch(pathname, publicRoutes);

  let hasValidSession = Boolean(accessToken);
  let updatedResponse: NextResponse | null = null;

  if (isPrivateKey) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const data = await checkSession();
          const setCookie = data.headers?.['set-cookie'];

          if (setCookie) {
            const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

            for (const cookieStr of cookieArray) {
              const parsed = parseSetCookie(cookieStr);
              if (parsed?.value) {
                cookieStore.set(parsed.name, parsed.value, parsed);
              }
            }

            hasValidSession = true;
            updatedResponse = NextResponse.next({
              headers: {
                Cookie: cookieStore.toString(),
              },
            });
          }
        } catch {
          hasValidSession = false;
        }
      } else {
        hasValidSession = false;
      }
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
