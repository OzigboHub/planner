const http = require('http');

fetch('http://localhost:3005')
  .then((r) => r.text())
  .then((html) => {
    console.log("=== META TAGS IN SERVER RESPONSE ===");
    const lines = html.split('\n');
    lines.forEach((line) => {
      if (line.includes('og:') || line.includes('twitter:') || line.includes('<title>')) {
        console.log(line.trim());
      }
    });
  })
  .catch(console.error);
