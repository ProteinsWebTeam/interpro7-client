// @flow
export default (input /*: HTMLInputElement | HTMLSelectElement */) => {
  switch (input.type) {
    case 'range':
      return parseFloat(input.value);
    case 'checkbox': //$FlowFixMe
      return input.checked;
    default:
      return input.value;
  }
};
