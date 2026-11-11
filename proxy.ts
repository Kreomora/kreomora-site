import {NextRequest,NextResponse} from 'next/server';

export function proxy(request:NextRequest){
 const path=request.nextUrl.pathname;
 const match=path.match(/^\/(ru|en)(\/|$)/);
 if(!match){
  const destination=request.nextUrl.clone();destination.pathname=`/ru${path==='/'?'/':path}`;
  return NextResponse.redirect(destination);
 }
 const locale=match[1],destination=request.nextUrl.clone();
 destination.pathname=path.replace(/^\/(ru|en)(?=\/|$)/,'')||'/';
 // Localized prefixes belong only to the public website, never to CMS or assets.
 if(/^\/(api|admin|_next|brand|portfolio)(\/|$)/.test(destination.pathname))return new NextResponse(null,{status:404});
 const headers=new Headers(request.headers);headers.set('x-kreomora-locale',locale);headers.set('x-kreomora-path',destination.pathname);
 return NextResponse.rewrite(destination,{request:{headers}});
}
export const config={matcher:['/((?!api|admin|_next|brand|portfolio|media|.*\\..*).*)']};
