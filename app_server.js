/* 
 * Scraper for TVGuide.dk and Mariendal Church
 * Two paths:
 *      <host>/tvguide
 *      <host>/mariendal
 * 
*/
require('dotenv').config();

// Host config
const port = process.env.LISTEN_PORT;

const http      = require('http');
const tvguide   = require('./tvguide');
const mariendal = require('./mariendal');

var server = http.createServer();
server.on('request',
    async (request, response) => {
 
        if (request.url === "/tvguide") {
            const rssFeed = await tvguide.getRSS(); // Wait for promise to resolve
            response.writeHead(200, {'Content-Type': 'application/rss+xml'});
            response.end(rssFeed);
        } else if (request.url === "/mariendal") {
            const rssFeed = await mariendal.getRSS(); // Wait for promise to resolve
            response.writeHead(200, {'Content-Type': 'application/rss+xml'});
            response.end(rssFeed);
        }
});

server.listen(port);
//const localHostIP = "192.168.1.10";
//server.listen(port, localHostIP);
//console.log('Listening on: '+hostIP+':'+port);