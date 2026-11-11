import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const netlify=process.argv.includes('--netlify');
const root=path.resolve(netlify?'.netlify-build/out':'.pages-build/out'),base=netlify?'':'/kreomora-site';
const port=netlify?4174:4173;
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.json':'application/json','.txt':'text/plain','.mp4':'video/mp4','.webm':'video/webm','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
 if(!pathname.startsWith(base+'/')){res.writeHead(404).end();return;}
 let file=path.resolve(root,'.'+pathname.slice(base.length));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const size=fs.statSync(file).size;const range=/^bytes=(\d+)-(\d*)$/.exec(req.headers.range||'');const start=range?Number(range[1]):0,end=range&&range[2]?Math.min(Number(range[2]),size-1):size-1;if(start>=size){res.writeHead(416).end();return;}res.writeHead(range?206:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${start}-${end}/${size}`}:{})});if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);}catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.join(root,'404.html')).on('error',()=>res.end('Not found')).pipe(res);}
}).listen(port,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:${port}${base}/`));
