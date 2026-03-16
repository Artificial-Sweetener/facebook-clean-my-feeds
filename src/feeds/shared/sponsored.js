function isSponsored(post, state) {
  if (!post || !state) {
    return false;
  }

  if (post.querySelector('a[href*="/ads/about/"]')) {
    return true;
  }

  if (hasSponsoredLinkSignature(post, state)) {
    return true;
  }

  return false;
}

function hasSponsoredLinkSignature(post, state) {
  const paramFind = "__cft__[0]=";
  const paramMinSize = state.isSF ? 250 : state.isVF ? 299 : 311;

  let elLinks = [];
  if (state.isNF || state.isGF) {
    elLinks = Array.from(
      post.querySelectorAll(
        `div[aria-posinset] span > a[href*="${paramFind}"]:not([href^="/groups/"]):not([href*="section_header_type"])`
      )
    );
    if (elLinks.length === 0) {
      elLinks = Array.from(
        post.querySelectorAll(
          `div[aria-describedby] span > a[href*="${paramFind}"]:not([href^="/groups/"]):not([href*="section_header_type"])`
        )
      );
    }
  } else if (state.isVF) {
    elLinks = Array.from(
      post.querySelectorAll(`div > div > div > div > span > span > div > a[href*="${paramFind}"]`)
    );
  } else if (state.isSF) {
    elLinks = Array.from(post.querySelectorAll(`div[role="article"] span > a[href*="${paramFind}"]`));
  }

  if (elLinks.length === 0 || elLinks.length >= 10) {
    return false;
  }

  const elMax = Math.min(2, elLinks.length);

  for (let i = 0; i < elMax; i += 1) {
    const el = elLinks[i];
    const pos = el.href.indexOf(paramFind);
    if (pos >= 0 && el.href.slice(pos).length >= paramMinSize) {
      return true;
    }
  }

  return false;
}

module.exports = {
  isSponsored,
};
