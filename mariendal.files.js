module.exports.writeRSS = writeRSS;

/*
* Grabs the current channel schedules from [MariendalKirke.dk] and scrape the current event
* list. Create RSS feed for use on e.g "my.yahoo.com" home page.
*/
require('dotenv').config({ path: "./app.env" });

const Xray  = require('x-ray');
const rss   = require('./rss_templates');
const fs    = require('fs');

const rssTitle      = "Mariendal Kirke";
const rssLink       = "https://www.mariendalkirke.dk";
const rssDesc       = "Nitivej 17, 2000 Frederiksberg - Tlf.3810.7355";
const eventsUrl     = process.env.MARIENDAL_EVENTS_DATA;
const maxTitleLen   = 60; // Title is to long for my.yahoo.com, so trim

function writeRSS(rssFileName) {
    // Contains rss
    let rssItems = "";
    let rssFeed  = "";

    // Scrape the data
    var x = Xray({
        filters: {
            trim: function (value) {
                // Strip leading whitespaces. Transform multi-whitespaces (spacesbar) to one
                // and replace other whitespace characters like \n etc with nothing
                return typeof value === 'string' ? value.replace(/\s{2,}/g,' ').trim() : value;
            }
        }
    });

    x(eventsUrl, '#sidebar-second', // Right hand sidebar has events
        { 
            page1: x('.page-1', // take page-1 only, that's 5 events
                [{
                    title:       '.event-title | trim',
                    date:        '.out-date-box | trim', // Short format w/o year
                    eventTime:   '.date-display-single', // Date AND time
                    contributor: '.contributor | trim',  // Person/Organization or none
                    link:        '.event-title a@href'
                }]
            )
        }
    )
    .then((data) => {
        data.page1.forEach(event => {
            var itemCopy = (rss.item()).slice(); // copy template
            //var itemCopy = RSS_ITEM_TEMPLATE.slice(); // copy template
            itemCopy = itemCopy.replace('ITEM_TITLE', event.date + ' - ' + event.title.substring(0,maxTitleLen-1));
            itemCopy = itemCopy.replace('ITEM_LINK', event.link);
            itemCopy = itemCopy.replace('ITEM_DESCRIPTION', (event.contributor == null ? "":"Ved: "+event.contributor+" -- ") + event.eventTime);
            rssItems = rssItems + itemCopy;
        })
        
        var rssCopy = (rss.container()).slice();
        rssCopy = rssCopy.replace("RSS_TITLE", rssTitle);
        rssCopy = rssCopy.replace("RSS_LINK", rssLink);
        rssCopy = rssCopy.replace("RSS_DESCRIPTION", rssDesc);
        
        // Tell user of feed that there is no features today if no items found
        rssCopy = rssCopy.replace('RSS_ITEMS',
            (rssItems === "" ? (rss.itemEmpty()).replace("RSS_LINK", rssLink) : rssItems));

        rssFeed = rssCopy;

        fs.writeFile(rssFileName, rssFeed, (err) => {
            if (err) throw err;
        });
    })
} // End writeRSS