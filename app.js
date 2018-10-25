/* 
 * Scraper for TVGuide.dk and Mariendal Church
 * Two paths:
 *      <host>/tvguide
 *      <host>/mariendal
 * 
*/

// Host config
//const port = process.env.PORT || 8080; // EvenNote host port from env; 8080 local

//const http      = require('http');
const tvguide   = require('./tvguide.write');
const mariendal = require('./mariendal.write');

// Produce rss files continuesly
const hour = 60*60*1000;

// Immediately write a set of files...
tvguide.writeRSS('tvguide.rss');
mariendal.writeRSS('mariendal.rss');

// ... then continue doing so forever, timed
setInterval(_tvguide,  1/4*hour); // Every 15 minutes
setInterval(_mariendal, 24*hour); // Once a day

function _tvguide() {
    tvguide.writeRSS('tvguide.rss');
}

function _mariendal() {
    mariendal.writeRSS('mariendal.rss');
}

/* var server = http.createServer();
server.on('request',
    async (request, response) => {
        //console.log('Request: '+request.url);
        
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

server.listen(port); */
//const localHostIP = "192.168.1.10";
//server.listen(port, localHostIP);
//console.log('Listening on: '+hostIP+':'+port);