// Build-only stand-in for Google Fonts (sandbox cannot reach fonts.googleapis.com). Never shipped.
const css = (family) => `@font-face { font-family: '${family}'; font-style: normal; font-weight: 100 900; font-display: swap; src: local('Arial'); unicode-range: U+0000-00FF; }`;
module.exports = new Proxy({}, {
  get: (_t, url) => {
    if (typeof url !== "string") return undefined;
    const m = /family=([^:&]+)/.exec(url);
    return css(m ? decodeURIComponent(m[1]).replace(/\+/g, " ") : "Arial");
  },
  has: () => true,
});
