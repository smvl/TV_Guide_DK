/* 
 * Scraper for TVGuide.dk and Mariendal Church
 * Produce rss files continuesly
*/
require('dotenv').config({ path: "./app.env" });

const tvguide   = require('./tvguide.files');
const mariendal = require('./mariendal.files');

const hour = 60*60*1000;

const path          = process.env.SERVER_DATA_DIR;
const tvguiderss    = path + process.env.TV_GUIDE_RSS;
const mariendalrss  = path + process.env.MARIENDAL_RSS;
const tv_intvl      = process.env.TV_GUIDE_UPDATE_INTERVAL * hour;
const mar_intvl     = process.env.MARIENDAL_UPDATE_INTERVAL * hour;

// Immediately write a set of files...
tvguide.writeRSS(tvguiderss);
mariendal.writeRSS(mariendalrss);

// ... then continue doing so forever, timed
setInterval(_tvguide,  tv_intvl); // Every 15 minutes
setInterval(_mariendal, mar_intvl); // Once a day

function _tvguide() {
    void tvguide.writeRSS(tvguiderss);
}

function _mariendal() {
    void mariendal.writeRSS(mariendalrss);
}