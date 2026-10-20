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

        // 1. Витягуємо заголовок set-cookie з відповіді бекенду
        const setCookieHeader = response.headers['set-cookie'];

        if (setCookieHeader) {
          // Створюємо тимчасовий об'єкт NextResponse, щоб скористатися вбудованим парсером Next.js
          const tempResponse = new NextResponse();
          const cookieHeaderValue = Array.isArray(setCookieHeader)
            ? setCookieHeader.join(', ')
            : setCookieHeader;
          tempResponse.headers.set('set-cookie', cookieHeaderValue);

          // Тепер Next.js сам безпечно розпарсив куки, і ми можемо пройтися по них
          tempResponse.cookies.getAll().forEach(cookie => {
            cookieStore.set(cookie.name, cookie.value, {
              path: cookie.path || '/',
              httpOnly: cookie.httpOnly,
              secure: cookie.secure,
              sameSite: cookie.sameSite,
              expires: cookie.expires,
            });
          });

          // Додатково прокидаємо заголовок у фінальну відповідь користувачу
          updatedResponse.headers.set('set-cookie', cookieHeaderValue);
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
