//
// Grabs the current schedule from TVGuide.dk
// 
var RSS_ITEM_TEMPLATE = 
`<item>
    <title>FEATURE_TITLE</title>
    <link>LINK_TO_TVGUIDE</link>
  </item>
  `
//var RSS_ITEM_TEMPLATE = `<item>`;

var RSS_TEMPLATE = `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>TVGuide.dk</title>
  <link>https://www.tvguide.dk</link>
  <description>Danmarks største online tv-guide</description>
  <language>DK</language>
  RSS_ITEMS
</channel>
</rss>`

const Xray = require('x-ray');
const wanted = new RegExp("(Clement|Price|barnaby|Gently|Morse|Hercule|Hun så et mord)", "i");

var x = Xray({
    filters: {
      trim: function (value) {
          // Strip leading whitespaces. Transform multi-whitespaces to one
          // and replace other whitespace characters like \n etc with nothing
        return typeof value === 'string' ? value.replace(/\s{2,}/g,' ').trim() : value;
      }
    }
});

let rssItems = "";

x('https://www.tvguide.dk/', {
    channels: x('.schedule--99', [{
        name    : '.schedule-header-channel-name | trim',
        features: x('.schedule-program-entry', [{
            title: '.schedule-program-entry-title | trim',
            start: '.schedule-program-entry-starts | trim',
            link:  'a@href'
        }])
    }])
}).then((data) => {
    data.channels.forEach(channel => {
        channelName = channel.name;
        channel.features.forEach(feature => {
            if (feature.title.match(wanted)) {
                //console.log('Kanal: ' + channelName + ' **Title: ' + feature.title + ' => Time: ' + feature.start);
                var newRssItem = RSS_ITEM_TEMPLATE.slice(); // copy template
                newRssItem = newRssItem.replace('FEATURE_TITLE', feature.start + ': ' + feature.title + ' [' + channelName + ']');
                newRssItem = newRssItem.replace('LINK_TO_TVGUIDE', feature.link);
                rssItems = rssItems + newRssItem;
            }
        })        
    });
    console.log(RSS_TEMPLATE.replace('RSS_ITEMS', rssItems));
});

