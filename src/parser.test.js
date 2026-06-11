const { parseRss, parseJsonFeed, decodeHtml } = await import("./parser.js");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function assertEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`${message || "assertEqual"}: ${actualJson} !== ${expectedJson}`);
  }
}

async function run(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`FAIL: ${name}`);
    console.error(error);
    failed += 1;
  }
}

await run("parseRss basic rss item", () => {
  const xml = "<rss><channel><item><title>T</title><link>https://example.com</link><description>D</description></item></channel></rss>";
  const result = parseRss(xml, { id: "s1", name: "S1", tag: "news", limit: 5 });
  assertEqual(result.length, 1, "length");
  assertEqual(result[0].title, "T", "title");
  assertEqual(result[0].link, "https://example.com", "link");
  assertEqual(result[0].tag, "news", "tag");
});

await run("parseRss atom entry", () => {
  const xml = "<feed><entry><title>A</title><link href='https://example.com/b'/><summary>S</summary></entry></feed>";
  const result = parseRss(xml, { id: "s2", name: "S2", limit: 5 });
  assertEqual(result.length, 1, "length");
  assertEqual(result[0].title, "A", "title");
  assertEqual(result[0].link, "https://example.com/b", "link");
});

await run("parseRss handles CDATA", () => {
  const xml = "<rss><channel><item><title><![CDATA[Hello & World]]></title><link>https://example.com/c</link><description><![CDATA[<b>x</b>]]></description></item></channel></rss>";
  const result = parseRss(xml, { id: "s3", name: "S3", limit: 5 });
  assertEqual(result[0].title, "Hello & World", "title");
  assertEqual(result[0].summary, "x", "summary");
});

await run("parseRss blocks javascript links", () => {
  const xml = "<rss><channel><item><title>T</title><link>javascript:alert(1)</link></item></channel></rss>";
  const result = parseRss(xml, { id: "s4", name: "S4", limit: 5 });
  assertEqual(result.length, 0, "length");
});

await run("parseRss empty input", () => {
  const result = parseRss("", { id: "s5", name: "S5", limit: 5 });
  assertEqual(result.length, 0, "length");
});

await run("parseJsonFeed normal item", () => {
  const json = JSON.stringify({
    version: "https://jsonfeed.org/version/1",
    items: [{ title: "J", url: "https://example.com/d", summary: "S", date_published: "2025-01-01T00:00:00Z" }]
  });
  const result = parseJsonFeed(json, { id: "s6", name: "S6", tag: "tech", limit: 5 });
  assertEqual(result.length, 1, "length");
  assertEqual(result[0].title, "J", "title");
  assertEqual(result[0].tag, "tech", "tag");
});

await run("parseJsonFeed drops items without title and link", () => {
  const json = JSON.stringify({ version: "1", items: [{}] });
  const result = parseJsonFeed(json, { id: "s7", name: "S7", limit: 5 });
  assertEqual(result.length, 0, "length");
});

await run("decodeHtml handles named and numeric entities", () => {
  assertEqual(decodeHtml("&amp; &#60; &#x3E;"), "& < >", "entities");
});

console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exitCode = 1;
}