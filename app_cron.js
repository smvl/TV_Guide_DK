/* 
 * Scraper for TVGuide.dk and Mariendal Church
 * 
*/
// print process.argv
/* process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
 */
arg = process.argv[2] ? process.argv[2] : "";

switch (arg) {
    case "tvguide":
        var tvguide = require('./tvguide.write');
        void tvguide.writeRSS();
        break;
    case "mariendal":
        const mariendal = require('./mariendal.write');
        void mariendal.writeRSS();
        break;
    default:
        var tvguide = require('./tvguide.write');
        void tvguide.writeRSS();
        break;
}