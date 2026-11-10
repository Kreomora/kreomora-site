import {buildStatic} from './build-static.mjs';

await buildStatic({
 directory:'.netlify-build',
 siteUrl:process.env.NEXT_PUBLIC_SITE_URL || 'https://lighthearted-meringue-7967d8.netlify.app',
 dataFile:'data/portfolio.json',
});
