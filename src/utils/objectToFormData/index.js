export default (object /*: {| [key: string]: any |} */) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      if (!value.length) continue;
      for (const item of value) {
        formData.append(key, item);
      }
    } else if (typeof value === 'object') {
      formData.set(key, JSON.stringify(value));
    } else {
      formData.set(key, value);
    }
  }
  return formData;
};
