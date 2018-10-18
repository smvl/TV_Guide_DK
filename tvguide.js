module.exports.getRSS = getRSS;

/*
* Grabs the current channel schedules from TVGuide.dk and selects what we want to see from a 
* predeterminded list. Create RSS feed for use on e.g "my.yahoo.com" home page.
*/
const Xray = require('x-ray');
const rss = require('./rss_templates');

const channelSelection = "(DR1|DR2|DR3|DRK|DR Ultra)"; // Other channels available, see tvguide.dk
const featureSelection = "(Clement|Price|Barnaby|Gently|Morse|Hercule|Hun s. et mord|Guld)";
const earliestTime = "08:00"; // Time not implemented
const latestTime = "23:00"; // Time not implemented
const rssTitle = "TVGuide.dk";
const rssLink = "https://www.tvguide.dk";
const rssDesc = "Danmarks største online tv-guide";
const maxTitleLen = 60; // Title is to long for my.yahoo.com, so trim

function getRSS() {
    // Contains rss
    let rssItems = "";
    let rssFeed  = "";

    const channelSel = new RegExp(channelSelection, "i");
    const featureSel = new RegExp(featureSelection, "i");

    // Setup x-ray + filter
    var x = Xray({
        filters: {
            trim: function (value) {
                // Strip leading whitespaces. Transform multi-whitespaces to one
                // and replace other whitespace characters like \n etc with nothing
                return typeof value === 'string' ? value.replace(/\s{2,}/g,' ').trim() : value;
            }
        }
    });

    // Use promise, we are async below...so return a Promise
    return new Promise(resolve => {
        // Scrape the data
        x('https://www.tvguide.dk/', {
            channels: x('.schedule--99', [{
                name    : '.schedule-header-channel-name | trim',

                // Current feature different from subsequent features
                start:   '.schedule-program-featured-header-starts | trim',
                feature: '.schedule-program-featured-title | trim',
                link:    '.schedule-program-entry-link@href',

                // List of later/future features
                features: x('.schedule-program-entry', [{
                    title: '.schedule-program-entry-title | trim',
                    start: '.schedule-program-entry-starts | trim',
                    link:  'a@href'
                }])
        }])})
        .then((data) => {
            data.channels.forEach(channel => {

                // Only show selected channels
                if (channel.name.match(channelSel)) {
                    let itemCopy = "";

                    // Current feature different from subsequent features, show if selected
                    if (channel.feature.match(featureSel)) {
                        itemCopy = (rss.item()).slice(); // copy template
                        itemCopy = itemCopy.replace('ITEM_TITLE', channel.start + ': ' + channel.feature.substring(0,maxTitleLen-1) + ' [' + channel.name + ']');
                        itemCopy = itemCopy.replace('ITEM_LINK', channel.link);
                        itemCopy = itemCopy.replace('ITEM_DESCRIPTION', "");
                        rssItems = rssItems + itemCopy;
                    }

                    // Later/future features, show if selected
                    channel.features.forEach(feature => {
                        if (feature.title.match(featureSel)) {
                            itemCopy = (rss.item()).slice(); // copy template
                            itemCopy = itemCopy.replace('ITEM_TITLE', feature.start + ': ' + feature.title.substring(0,maxTitleLen-1) + ' [' + channel.name + ']');
                            itemCopy = itemCopy.replace('ITEM_LINK', feature.link);
                            itemCopy = itemCopy.replace('ITEM_DESCRIPTION', "");
                            rssItems = rssItems + itemCopy;
                        }
                    })
                }
            });
                        
            let rssCopy = (rss.container()).slice();
            rssCopy = rssCopy.replace("RSS_TITLE", rssTitle);
            rssCopy = rssCopy.replace("RSS_LINK", rssLink);
            rssCopy = rssCopy.replace("RSS_DESCRIPTION", rssDesc);
            // Tell user of feed that there is no features today if no items found
            rssCopy = rssCopy.replace('RSS_ITEMS',
                (rssItems === "" ? (rss.itemEmpty()).replace("RSS_TITLE", rssTitle) : rssItems));

            // Promise resolved, return the new shiny RSS
            rssFeed = rssCopy;
            resolve(rssFeed); 
        })
    }) // End Promise
}