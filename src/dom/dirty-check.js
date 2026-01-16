function hasSizeChanged(oldValue, newValue, tolerance = 16) {
  if (oldValue === null || oldValue === undefined) {
    return true;
  }

  const oldNumber = parseInt(oldValue, 10);
  const newNumber = parseInt(newValue, 10);

  if (Number.isNaN(oldNumber) || Number.isNaN(newNumber)) {
    return true;
  }

  return Math.abs(newNumber - oldNumber) > tolerance;
}

module.exports = {
  hasSizeChanged,
};
