function generateRandomString(length = 13) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const firstChar = chars.charAt(Math.floor(Math.random() * 52));
  const strArray = [firstChar];

  for (let i = 1; i < length; i += 1) {
    strArray.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }

  return strArray.join("");
}

module.exports = {
  generateRandomString,
};
