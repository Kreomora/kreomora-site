export async function submitInquiry(data:FormData):Promise<{mode:'demo'}>{
 // TODO: Replace this adapter with a real endpoint; add server-side validation,
 // spam protection and a privacy notice before collecting personal information.
 if(!data.get('name')||!data.get('email')||!data.get('message'))throw new Error('Missing required fields');
 await new Promise(resolve=>setTimeout(resolve,600));return {mode:'demo'};
}
