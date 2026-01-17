const groupsSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  groupPageMainColumn: 'div[role="main"] div[role="feed"]',
  dialog: 'div[role="dialog"]',
  feedQueryRecent: 'h2[dir="auto"] + div > div',
  feedQueryMultiple: 'div[role="feed"] > div',
  feedQuerySingle: 'div[role="feed"] > div',
};

module.exports = {
  groupsSelectors,
};
