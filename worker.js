export default {

async fetch(request){

const url=new URL(request.url)

const target=url.searchParams.get("url")

if(!target){

return new Response("No URL")

}

const res=await fetch(target)

const headers=new Headers(res.headers)

headers.set("Access-Control-Allow-Origin","*")

return new Response(res.body,{
status:res.status,
headers
})

}

}
