const cleanName = (name) => {
  const trimmedName = name.trim("");
  return trimmedName[0].toUpperCase() + trimmedName.slice(1);
};

module.exports = cleanName;
