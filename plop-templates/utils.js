exports.notEmpty = (name) => (v) => {
  if (!v || v.trim === '') {
    return `${name} is required`;
  }
  return true;
};
