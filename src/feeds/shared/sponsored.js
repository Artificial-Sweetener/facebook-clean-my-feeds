const cftParam = "__cft__[0]=";
const maximumCandidateLinks = 10;
const maximumInspectedLinks = 2;

function isSponsored(post, state) {
  return inspectSponsored(post, state).isSponsored;
}

function getSponsoredDiagnostics(post, state) {
  return inspectSponsored(post, state).diagnostics;
}

function inspectSponsored(post, state) {
  const diagnostics = createSponsoredDiagnostics(post, state);
  if (!post || !state) {
    return { isSponsored: false, diagnostics };
  }

  diagnostics.adsAboutLinkCount = post.querySelectorAll('a[href*="/ads/about/"]').length;
  if (diagnostics.adsAboutLinkCount > 0) {
    diagnostics.matchedBy = "ads-about";
    return { isSponsored: true, diagnostics };
  }

  const candidates = collectCftLinkCandidates(post, state);
  diagnostics.cftLinks.nestedWrapperCount = candidates.nestedWrapperCount;
  diagnostics.cftLinks.rootContainerCount = candidates.rootContainerCount;
  diagnostics.cftLinks.selectedSource = candidates.selectedSource;
  diagnostics.cftLinks.selectedCount = candidates.links.length;
  diagnostics.cftLinks.rejectedForVolume = candidates.links.length >= maximumCandidateLinks;

  if (diagnostics.cftLinks.rejectedForVolume) {
    return { isSponsored: false, diagnostics };
  }

  const inspectedLinks = candidates.links.slice(0, maximumInspectedLinks);
  diagnostics.cftLinks.inspectedCount = inspectedLinks.length;
  inspectedLinks.forEach((link) => {
    const paramPosition = link.href.indexOf(cftParam);
    const signatureLength = paramPosition >= 0 ? link.href.slice(paramPosition).length : 0;
    if (signatureLength >= diagnostics.cftLinks.minimumSignatureLength) {
      diagnostics.cftLinks.meetsMinimumCount += 1;
    } else {
      diagnostics.cftLinks.belowMinimumCount += 1;
    }
  });

  const isSponsoredPost = diagnostics.cftLinks.meetsMinimumCount > 0;
  if (isSponsoredPost) {
    diagnostics.matchedBy = "cft-link-signature";
  }
  return { isSponsored: isSponsoredPost, diagnostics };
}

function collectCftLinkCandidates(post, state) {
  const linkSelector = `span > a[href*="${cftParam}"]:not([href^="/groups/"]):not([href*="section_header_type"])`;
  const rootContainer = post.matches(
    'div[role="article"], div[aria-posinset], div[aria-describedby]'
  );
  let links = [];
  let selectedSource = "none";

  if (state.isNF || state.isGF) {
    links = Array.from(post.querySelectorAll(`div[aria-posinset] ${linkSelector}`));
    if (links.length === 0) {
      links = Array.from(post.querySelectorAll(`div[aria-describedby] ${linkSelector}`));
    }
    if (links.length > 0) {
      selectedSource = "nested-wrapper";
    }
  } else if (state.isVF) {
    links = Array.from(
      post.querySelectorAll(`div > div > div > div > span > span > div > a[href*="${cftParam}"]`)
    );
    if (links.length > 0) {
      selectedSource = "video-wrapper";
    }
  } else if (state.isSF) {
    links = Array.from(post.querySelectorAll(`div[role="article"] ${linkSelector}`));
    if (links.length > 0) {
      selectedSource = "nested-article";
    }
  }

  const nestedWrapperCount = links.length;
  let rootContainerCount = 0;
  if (links.length === 0 && rootContainer && (state.isNF || state.isGF || state.isSF)) {
    links = Array.from(post.querySelectorAll(linkSelector));
    rootContainerCount = links.length;
    if (links.length > 0) {
      selectedSource = "post-root";
    }
  }

  return { links, nestedWrapperCount, rootContainerCount, selectedSource };
}

function createSponsoredDiagnostics(post, state) {
  const canMatchRoot = !!(post && typeof post.matches === "function");
  return {
    matchedBy: "none",
    adsAboutLinkCount: 0,
    rootContainer:
      canMatchRoot &&
      post.matches('div[role="article"], div[aria-posinset], div[aria-describedby]'),
    rootRoleArticle: canMatchRoot && post.matches('div[role="article"]'),
    rootAriaPosinset: canMatchRoot && post.matches("div[aria-posinset]"),
    rootAriaDescribedby: canMatchRoot && post.matches("div[aria-describedby]"),
    cftLinks: {
      minimumSignatureLength: state ? (state.isSF ? 250 : state.isVF ? 299 : 311) : 0,
      nestedWrapperCount: 0,
      rootContainerCount: 0,
      selectedSource: "none",
      selectedCount: 0,
      inspectedCount: 0,
      belowMinimumCount: 0,
      meetsMinimumCount: 0,
      rejectedForVolume: false,
    },
  };
}

module.exports = {
  getSponsoredDiagnostics,
  isSponsored,
};
