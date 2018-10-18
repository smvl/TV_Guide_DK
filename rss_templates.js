module.exports.container = container;
module.exports.item = item;
module.exports.itemEmpty = itemEmpty;

function container() {
    return `<?xml version="1.0" encoding="UTF-8" ?>
        <rss version="2.0">
        <channel>
        <title>RSS_TITLE</title>
        <link>RSS_LINK</link>
        <description>RSS_DESCRIPTION</description>
        <language>da</language>
        RSS_ITEMS
        </channel>
        </rss>`
}

function item() {
    return `<item>
    <title>ITEM_TITLE</title>
    <link>ITEM_LINK</link>
    <description>ITEM_DESCRIPTION</description>
    </item>
    `
}

function itemEmpty() {
    return `<item>
    <title>Ingen film idag!</title>
    <link>RSS_LINK</link>
    </item>
`
}