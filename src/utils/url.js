function getPathSegments(pathname) {
  if (typeof pathname !== "string") {
    return [];
  }

  return pathname.split("/").filter(Boolean);
}

function hasPathSegment(pathname, segment) {
  if (typeof segment !== "string" || segment.length === 0) {
    return false;
  }

  return getPathSegments(pathname).includes(segment);
}

module.exports = {
  getPathSegments,
  hasPathSegment,
};
