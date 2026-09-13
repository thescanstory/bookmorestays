(async () => {
  const url = 'https://www.instagram.com/reel/DajyFOri7MV/';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5'
  };
  
  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    
    // Extract og:title and og:description
    const titleMatch = text.match(/<meta property="og:title" content="(.*?)"/i);
    const descMatch = text.match(/<meta property="og:description" content="(.*?)"/i);
    
    console.log("Title Match:", titleMatch ? titleMatch[1] : "Not found");
    console.log("Desc Match:", descMatch ? descMatch[1] : "Not found");
    
    // Check if it's the login page
    if (text.includes('Login • Instagram')) {
      console.log("Hit Login Wall");
    }
  } catch (e) {
    console.error(e);
  }
})();
