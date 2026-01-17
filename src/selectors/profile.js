const profileSelectors = {
  mainColumn: 'div[role="main"]',
  dialog: 'div[role="dialog"]',
  postsQuery:
    'div[role="main"] > div > div > div > div:nth-of-type(2) > div:not([class]) > div > div[class]',
};

module.exports = {
  profileSelectors,
};
