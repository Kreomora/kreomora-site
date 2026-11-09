import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomBytes} from 'node:crypto';
const base=process.env.CMS_TEST_URL||'http://localhost:3000';
const credentials=readFileSync('storage/admin-credentials.txt','utf8');
const email=credentials.match(/^Email: (.+)$/m)[1],password=credentials.match(/^Password: (.+)$/m)[1];
const request=(path,options={})=>fetch(base+path,options);
const login=await request('/api/users/login/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});assert.equal(login.status,200);
const {token}=await login.json();const headers={'Content-Type':'application/json',Authorization:`JWT ${token}`};
const slug=`cms-check-${randomBytes(5).toString('hex')}`;let id,mediaID;
try{
 const blocked=await request('/api/users/first-register/',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(blocked.status,403);
 const denied=await request('/api/projects/',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(denied.status,403);
 const form=new FormData();form.set('_payload',JSON.stringify({alt:'HTTP upload check',visibility:'private'}));form.set('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64')],{type:'image/png'}),`${slug}.png`);
 const upload=await request('/api/media/',{method:'POST',headers:{Authorization:`JWT ${token}`},body:form});assert.equal(upload.status,201);const {doc:asset}=await upload.json();mediaID=asset.id;
 const privateFile=await fetch(new URL(asset.url,base));assert([401,403,404].includes(privateFile.status),'Private upload accessible');
 await request(`/api/media/${mediaID}/`,{method:'PATCH',headers,body:JSON.stringify({visibility:'public'})});
 assert.equal((await fetch(new URL(asset.url,base))).status,200);
 const created=await request('/api/projects/?draft=true',{method:'POST',headers,body:JSON.stringify({title:slug,slug,section:'studio',theme:'warm',year:2026,description:'HTTP publishing check',cover:mediaID,featured:true,displayOrder:-999,_status:'draft'})});assert.equal(created.status,201);id=(await created.json()).doc.id;
 assert.equal((await request(`/studio/${slug}/`)).status,404);
 const patch=data=>request(`/api/projects/${id}/`,{method:'PATCH',headers,body:JSON.stringify(data)});
 assert.equal((await patch({_status:'published'})).status,200);
 for(const path of ['/', '/studio/work/',`/studio/${slug}/`,'/sitemap.xml']){const r=await request(path);assert.equal(r.status,200);assert((await r.text()).includes(slug),`${path} did not update`);}
 const ordered=await (await request('/api/projects/?sort=displayOrder&limit=1')).json();assert.equal(ordered.docs[0].id,id);
 await patch({section:'multstory',slug:`${slug}-edited`,title:'Edited project'});
 assert.equal((await request(`/studio/${slug}/`)).status,404);assert.equal((await request(`/multstory/${slug}-edited/`)).status,200);
 assert((await (await request('/multstory/stories/')).text()).includes(`${slug}-edited`));
 await patch({_status:'draft'});assert.equal((await request(`/multstory/${slug}-edited/`)).status,404);assert(!(await (await request('/')).text()).includes(`${slug}-edited`));
 console.log('PASS: REST login, denied anonymous writes/bootstrap, upload privacy, publish-to-home/archive/case/sitemap, reorder, section/slug edits, unpublish.');
}finally{if(id)await request(`/api/projects/${id}/`,{method:'DELETE',headers});if(mediaID)await request(`/api/media/${mediaID}/`,{method:'DELETE',headers});}
