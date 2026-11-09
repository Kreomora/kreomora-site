import {NextRequest,NextResponse} from 'next/server';

export function proxy(request:NextRequest){
 const path=request.nextUrl.pathname;
 const match=path.match(/^\/(ru|en)(\/|$)/);
 if(!match){
  const locale=request.cookies.get('kreomora-locale')?.value==='en'?'en':'ru';
  const destination=request.nextUrl.clone();destination.pathname=`/${locale}${path==='/'?'/':path}`;
  return NextResponse.redirect(destination);
 }
 const locale=match[1],destination=request.nextUrl.clone();
 destination.pathname=path.replace(/^\/(ru|en)(?=\/|$)/,'')||'/';
 // Localized prefixes belong only to the public website, never to CMS or assets.
 if(/^\/(api|admin|_next|brand|portfolio)(\/|$)/.test(destination.pathname))return new NextResponse(null,{status:404});
 const headers=new Headers(request.headers);headers.set('x-kreomora-locale',locale);headers.set('x-kreomora-path',destination.pathname);
 const response=NextResponse.rewrite(destination,{request:{headers}});
 if(!request.headers.has('next-router-prefetch')&&request.headers.get('purpose')!=='prefetch')response.cookies.set('kreomora-locale',locale,{path:'/',maxAge:31536000,sameSite:'lax',httpOnly:true,secure:request.nextUrl.protocol==='https:'});
 return response;
}
export const config={matcher:['/((?!api|admin|_next|brand|portfolio|media|.*\\..*).*)']};
