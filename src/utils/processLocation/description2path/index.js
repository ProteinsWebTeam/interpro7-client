// @flow
const orderedKeys = new Set([
  'other',
  'mainType',
  'mainIntegration',
  'mainDB',
  'mainAccession',
  'mainChain',
  'mainMemberDB',
  'mainMemberDBAccession',
  'mainDetail',
  'focusType',
  'focusIntegration',
  'focusDB',
  'focusAccession',
  'focusChain',
  'focusMemberDB',
  'focusMemberDBAccession',
]);

export default (description/*: {[key: string]: ?string} */) => {
  let output = '/';
  for (const key of orderedKeys) {
    const value = description[key];
    if (value) {// filter out empty values
      output += value + '/';// eslint-disable-line prefer-template
      if (key === 'other' || key === 'mainDetail') {// break before if dead end
        break;
      }
    }
  }
  return output;
};
