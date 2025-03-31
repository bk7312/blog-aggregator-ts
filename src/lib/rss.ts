import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const res = await fetch(feedURL, {
    headers: {
      "user-agent": "gator",
    },
  });
  const data = await res.text();
  //   console.log("fetch feed data", data);
  const parser = new XMLParser();
  const obj = parser.parse(data);
  //   console.log(JSON.stringify(obj));
  //   obj = {xml, rss},
  //   rss = {channel}
  //   channel = {title, link, description, item...}
  //   for (let key in obj.rss.channel) {
  //     console.log(key);
  //   }
  if (!validateXML(obj)) {
    console.log("xml doesn't contain rss");
  }
  let rssObj: RSSFeed = obj.rss;
  if (!validateRSSFeed(rssObj)) {
    console.log("invalid rss obj");
  }
  const filteredItems = rssObj.channel.item.filter((i: RSSItem) =>
    validateRSSItem(i)
  );
  rssObj.channel.item = filteredItems;
  return rssObj;
}

function validateXML(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.rss === "object" &&
    obj.rss !== null
  );
}

function validateRSSFeed(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    obj.channel !== null &&
    typeof obj.channel === "object" &&
    typeof obj.channel.title === "string" &&
    typeof obj.channel.link === "string" &&
    typeof obj.channel.description === "string" &&
    Array.isArray(obj.channel.item)
  );
}
function validateRSSItem(obj: any): boolean {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.title === "string" &&
    typeof obj.link === "string" &&
    typeof obj.description === "string" &&
    typeof obj.pubDate === "string"
  );
}
