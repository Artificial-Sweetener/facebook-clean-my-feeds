// SPDX-License-Identifier: GPL-3.0-only

import { collectProfilePosts, mopProfileFeed } from "../../src/feeds/profile";
import { mopSearchFeed } from "../../src/feeds/search";
import { postAtt } from "../../src/dom/attributes";
import {
  getProfilePostCollection,
  getSearchPostCollection,
} from "../../src/diagnostics/collection";
import { cleanRouteDocument, element, routeContext, textPost } from "./routes-fixtures";

afterEach(cleanRouteDocument);

/** Reproduce the live profile's owned author marker and opaque date link without retaining personal data. */
function profilePost(id: string, body: string, attributes = 'aria-posinset="1"'): string {
  return `<div id="${id}" ${attributes}><div><div><div data-ad-rendering-role="profile_name"><h2><a href="/profile.php?id=123">Author</a></h2></div><a href="?__cft__[0]=opaque#?abc">Unknown date</a></div><div data-ad-rendering-role="story_message"><span>${body}</span></div></div></div>`;
}

test("profile filtering processes opaque-date posts independently of neighboring profile content", () => {
  document.body.innerHTML = `<div role="main" id="root"><section id="intro">blocked intro</section><div id="transport">${profilePost("blocked", "blocked")}${profilePost("ordinary", "ordinary")}</div></div>`;
  const context = routeContext("/profile.php?id=123", {
    PP_BLOCKED_ENABLED: true,
    PP_BLOCKED_TEXT: "blocked",
  });
  expect(collectProfilePosts(element("root"))).toEqual([element("blocked"), element("ordinary")]);
  mopProfileFeed(context);
  expect(element("blocked").getAttribute(postAtt)).toBe("blocked");
  for (const id of ["root", "intro", "transport", "ordinary"])
    expect(element(id).hasAttribute(postAtt)).toBe(false);
  expect(getProfilePostCollection().posts).toEqual([element("blocked"), element("ordinary")]);
});

test.each(['role="article"', 'aria-posinset="1"'])(
  "profile structural discovery preserves older permalink siblings beside %s posts",
  (attributes) => {
    document.body.innerHTML = `<div id="root"><section>${profilePost("modern", "ordinary", attributes)}<div id="legacy"><a href="/person/posts/123/">Date</a><span>Body</span></div></section></div>`;
    expect(collectProfilePosts(element("root"))).toEqual([element("modern"), element("legacy")]);
  }
);

test.each([
  "hidden",
  'style="display:none"',
  'aria-hidden="true"',
  'data-commentid="1"',
  'data-ad-preview="message"',
])("profile structural discovery excludes posts inside %s", (attributes) => {
  document.body.innerHTML = `<div id="root"><div ${attributes}>${profilePost("foreign", "blocked")}</div></div>`;
  expect(collectProfilePosts(element("root"))).toEqual([]);
});

test("a nested author signal cannot make a transport wrapper a profile post", () => {
  document.body.innerHTML = `<div id="root"><div aria-posinset="1" id="transport">${profilePost("post", "ordinary")}</div></div>`;
  expect(collectProfilePosts(element("root"))).toEqual([element("post")]);
});

test("profile discovery keeps a quoted post within its authored parent", () => {
  document.body.innerHTML = `<div id="root">${profilePost("outer", profilePost("quote", "ordinary"))}</div>`;
  expect(collectProfilePosts(element("root"))).toEqual([element("outer")]);
});

test("an unlabelled quoted article remains part of its structurally identified parent", () => {
  document.body.innerHTML = `<div id="root">${profilePost("outer", "ordinary")}</div>`;
  element("outer").insertAdjacentHTML(
    "beforeend",
    profilePost("quote", "blocked", 'role="article"')
  );
  expect(collectProfilePosts(element("root"))).toEqual([element("outer")]);
});

test.each(["hidden author", "hidden link", "external author", "body author", "missing author"])(
  "profile discovery rejects %s evidence without a permalink",
  (variant) => {
    document.body.innerHTML = `<div id="root">${profilePost("post", "ordinary")}</div>`;
    const author = element("post").querySelector('[data-ad-rendering-role="profile_name"]');
    if (!author) throw new Error("Fixture requires an author marker");
    if (variant === "hidden author") author.setAttribute("hidden", "");
    if (variant === "hidden link") author.querySelector("a")?.setAttribute("hidden", "");
    if (variant === "external author")
      author.innerHTML = '<a href="https://example.org/person">Author</a>';
    if (variant === "body author") author.setAttribute("data-ad-preview", "message");
    if (variant === "missing author") author.removeAttribute("data-ad-rendering-role");
    expect(collectProfilePosts(element("root"))).toEqual([]);
  }
);

test.each([
  "https://example.org/person/posts/123/",
  "/person?next=/posts/123/",
  "/not-story.php?story_fbid=123",
  "javascript:void('/posts/123/')",
])("profile discovery rejects a non-permalink destination: %s", (href) => {
  document.body.innerHTML = `<div id="root"><div><a href="${href}">Unknown</a></div></div>`;
  expect(collectProfilePosts(element("root"))).toEqual([]);
});

test.each(["article", 'section role="article"'])(
  "profile discovery retains the %s boundary beside unrelated content",
  (tag) => {
    const closing = tag.split(" ")[0];
    document.body.innerHTML = `<div id="root"><section><${tag} id="post"><a href="/person/posts/123/">Unknown</a></${closing}><div>Unrelated content</div></section></div>`;
    expect(collectProfilePosts(element("root"))).toEqual([element("post")]);
  }
);

test.each(["hidden", 'data-commentid="123"'])(
  "profile discovery cannot start from a permalink inside %s content",
  (attribute) => {
    document.body.innerHTML = `<div id="root"><section><div ${attribute}><a href="/person/posts/123/">Unknown</a></div><div>Unrelated content</div></section></div>`;
    expect(collectProfilePosts(element("root"))).toEqual([]);
  }
);

test("search transport wrappers cannot be hidden with an independently matching child post", () => {
  const context = routeContext("/search/posts/", {
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_TEXT: "blocked",
  });
  document.body.innerHTML = `<div role="region"></div><div role="main"><div role="feed"><div><div id="transport">${textPost("blocked", "blocked")}${textPost("ordinary", "ordinary")}</div></div></div></div>`;
  mopSearchFeed(context);
  expect(element("transport").hasAttribute(postAtt)).toBe(false);
  expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  expect(element("blocked").getAttribute(postAtt)).toBe("blocked");
});

test("search discovery excludes independent feeds embedded in comments", () => {
  const context = routeContext("/search/posts/", {
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_TEXT: "blocked",
  });
  document.body.innerHTML = `<div role="region"></div><div role="main"><div data-commentid="123"><div role="feed"><div>${textPost("comment", "blocked")}</div></div></div></div>`;
  mopSearchFeed(context);
  expect(element("comment").hasAttribute(postAtt)).toBe(false);
});

test("reports select the same independent profile and search posts as production", () => {
  document.body.innerHTML = `<div role="region"></div><div role="main"><div role="feed"><div><div>${textPost("first", "ordinary", '<a href="/person/posts/123/">Date</a>')}${textPost("second", "ordinary", '<a href="/person/posts/456/">Date</a>')}</div></div></div></div>`;
  expect(getSearchPostCollection().posts).toEqual([element("first"), element("second")]);
  expect(getProfilePostCollection().posts).toEqual([element("first"), element("second")]);
});
