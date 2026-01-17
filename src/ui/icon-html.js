function buildIconHTML(dataUri, extraClassName = "") {
  const classes = ["cmf-icon"];
  if (extraClassName) {
    classes.push(extraClassName);
  }
  const className = classes.join(" ");
  return `<span class="${className}" aria-hidden="true" style="--cmf-icon-url: url('${dataUri}')"></span>`;
}

module.exports = {
  buildIconHTML,
};
