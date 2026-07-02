const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('--- HEAD ---');
    const headMatch = data.match(/<head>([\s\S]*?)<\/head>/);
    if (headMatch) {
      console.log(headMatch[1].substring(0, 1000));
    }
    console.log('--- BODY SCRIPTS ---');
    const scripts = data.match(/<script[\s\S]*?<\/script>/g) || [];
    scripts.forEach(script => {
      if (script.includes('google') || script.includes('gaId') || script.includes('G-') || script.includes('gtag')) {
        console.log(script);
      }
    });
  });
}).on('error', (err) => {
  console.error('Error fetching page:', err.message);
});
