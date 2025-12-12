function cleanOrgName(name) {
  if (!name || typeof name !== "string") return "";

  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

module.exports = { cleanOrgName };
