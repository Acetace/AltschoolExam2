const http = require('http');
const port = 3000;

http.createServer((req, res) => {
	  res.writeHead(200, { 'Content-Type': 'text/html' });
	  res.end('<h1>Hello from Node.js behind Nginx!</h1>');
}).listen(port, () => {
	  console.log(`Server running on http://localhost:${port}`);
});

