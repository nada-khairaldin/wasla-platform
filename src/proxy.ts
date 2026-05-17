// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function proxy(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;
//   const { pathname } = request.nextUrl;

//   const isAuthPage = pathname === '/login' || pathname.startsWith('/signup');
//   const isPublicPage = pathname === '/'; 

//   if (!token && !isAuthPage && !isPublicPage) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (token && (isAuthPage || isPublicPage)) {
//     return NextResponse.redirect(new URL('/home', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)',
//   ],
// };
export function proxy(){
  
}