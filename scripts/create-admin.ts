import {createInterface} from 'node:readline/promises';
import {Writable} from 'node:stream';
import {getPayload} from 'payload';
import config from '../payload.config';
let hidden=false;
const output=new Writable({write(chunk,_encoding,callback){if(!hidden)process.stdout.write(chunk);callback();}});
const input=createInterface({input:process.stdin,output,terminal:true});
try{
 const email=(await input.question('Admin email: ')).trim();
 const name=(await input.question('Name: ')).trim();
 process.stdout.write('Password (12+ characters, hidden): ');hidden=true;const password=await input.question('');hidden=false;process.stdout.write('\n');
 if(!email.includes('@')||!name||password.length<12)throw new Error('Valid email, name, and a password of at least 12 characters are required.');
 const payload=await getPayload({config});
 const exists=await payload.find({collection:'users',where:{email:{equals:email}},limit:1});
 if(exists.totalDocs)throw new Error('This account already exists. No changes made.');
 await payload.create({collection:'users',data:{email,name,password},overrideAccess:true});
 console.log('Admin created. Sign in at /admin.');await payload.destroy();
}finally{input.close();}
