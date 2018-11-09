/* 
 * Scraper for TVGuide.dk and Mariendal Church.
 * Create rss files on command. Schedule with cron
 * Mariendal should be run every 24 hrs. Tvguide
 * should run every 20 minutes or whatever.
 * 
*/
require('dotenv').config();
const tvguiderss   = path + process.env.TV_GUIDE_RSS;
const mariendalrss = path + process.env.MARIENDAL_RSS;

arg = process.argv[2] ? process.argv[2] : "";

switch (arg.toLower()) {
    case "tvguide":
        var tvguide = require('./tvguide.files');
        void tvguide.writeRSS(tvguiderss);
        break;
    case "mariendal":
        const mariendal = require('./mariendal.files');
        void mariendal.writeRSS(mariendalrss);
        break;
    default:
        var tvguide = require('./tvguide.files');
        void tvguide.writeRSS(tvguiderss);
        break;
}