const video = document.getElementById("video")
const results = document.getElementById("results")
const statusBox = document.getElementById("status")

let database = []

const sites = [

"https://www.skylinewebcams.com/",
"https://www.earthcam.com/",
"https://www.windy.com/webcams"

]

async function fetchPage(url){

const proxy="https://api.allorigins.win/raw?url="

const res=await fetch(proxy+encodeURIComponent(url))

return await res.text()

}

function extractStreams(html){

const regex=/(https?:\/\/[^"' ]+\.(m3u8|mpd|mjpeg|mjpg)[^"' ]*)/gi

const matches=html.match(regex)

if(!matches) return []

return [...new Set(matches)]

}

function renderStreams(list){

results.innerHTML=""

list.forEach(url=>{

const div=document.createElement("div")

div.className="stream"

div.innerHTML=`

<a href="${url}" target="_blank">${url}</a>

<button onclick="play('${url}')">Play</button>

<button onclick="save('${url}')">Save</button>

`

results.appendChild(div)

})

}

function play(url){

if(Hls.isSupported()){

const hls=new Hls()

hls.loadSource(url)

hls.attachMedia(video)

}else{

video.src=url

}

}

function save(url){

database.push({

name:"Camera "+database.length,

stream:url

})

statusBox.innerText="Saved to database"

}

async function scanPage(){

const url=document.getElementById("urlInput").value

if(!url) return

statusBox.innerText="Scanning..."

try{

const html=await fetchPage(url)

const streams=extractStreams(html)

renderStreams(streams)

statusBox.innerText="Scan selesai"

}catch{

statusBox.innerText="Scan gagal"

}

}

async function scanDefault(){

statusBox.innerText="Scanning websites..."

let all=[]

for(const site of sites){

try{

const html=await fetchPage(site)

const streams=extractStreams(html)

all.push(...streams)

}catch{}

}

all=[...new Set(all)]

renderStreams(all)

statusBox.innerText="Scan selesai"

}

function exportJSON(){

const data={cameras:database}

const blob=new Blob(
[JSON.stringify(data,null,2)],
{type:"application/json"}
)

const a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="cctv-database.json"

a.click()

}

function exportM3U(){

let playlist="#EXTM3U\n\n"

database.forEach((cam,i)=>{

playlist+=`#EXTINF:-1,Camera ${i}\n${cam.stream}\n\n`

})

const blob=new Blob([playlist],{type:"text/plain"})

const a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="playlist.m3u"

a.click()

}
