import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('sb-access-token')?.value;

    const publicPaths = ['/login', '/favicon.ico', '/_next', '/images'];
    const isPublic = publicPaths.some((path) => req.nextUrl.pathname.startsWith(path));

    if (!token && !isPublic) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
