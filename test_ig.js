const https = require('https');

https.get('https://www.instagram.com/reel/DWJLhp2Dxfn/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const titleMatch = data.match(/<meta property="og:title" content="(.*?)"/);
    const imgMatch = data.match(/<meta property="og:image" content="(.*?)"/);
    const vidMatch = data.match(/<meta property="og:video" content="(.*?)"/);
    console.log("Title:", titleMatch ? titleMatch[1] : "not found");
    console.log("Image:", imgMatch ? imgMatch[1] : "not found");
    console.log("Video:", vidMatch ? vidMatch[1] : "not found");
  });
}).on('error', (e) => {
  console.error(e);
});
