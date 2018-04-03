export default param => search => {
  const { [param]: value, ...rest } = search;
  if (typeof value !== 'undefined') rest[param] = +value;
  return rest;
};
