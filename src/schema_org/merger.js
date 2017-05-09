const rootData = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  url: 'https://www.ebi.ac.uk/interpro',
  mainEntityOfPage: '@mainEntity',
};

const merger = (dataMap, toBeProcessed = rootData) => {
  const schema = {};
  for (const [key, value] of Object.entries(toBeProcessed)) {
    if (value[0] === '@') {
      const data = Array.from(dataMap.get(value) || []);
      // we have data, add it
      if (data.length) {
        if (data.length === 1) {
          // if one piece of data, pass the piece
          schema[key] = merger(dataMap, data[0]);
        } else {
          // if multiple data, pass as array
          schema[key] = data.map(datum => merger(dataMap, datum));
        }
      }// else don't add
    } else {
      schema[key] = value;
    }
  }
  return schema;
};

export default merger;
