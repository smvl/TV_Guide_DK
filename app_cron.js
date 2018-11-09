/* 
 * Scraper for TVGuide.dk and Mariendal Church.
 * Create rss files on command. Schedule with cron
 * Mariendal should be run every 24 hrs. Tvguide
 * should run every 20 minutes or whatever.
 * 
*/
require('dotenv').config();
const tvguide   = path + process.env.TV_GUIDE_RSS;
const mariendal = path + process.env.MARIENDAL_RSS;

arg = process.argv[2] ? process.argv[2] : "";

switch (arg.toLower()) {
    case "tvguide":
        var tvguide = require('./tvguide.files');
        void tvguide.writeRSS(tvguide);
        break;
    case "mariendal":
        const mariendal = require('./mariendal.files');
        void mariendal.writeRSS(mariendal);
        break;
    default:
        var tvguide = require('./tvguide.files');
        void tvguide.writeRSS(tvguide);
        break;
}