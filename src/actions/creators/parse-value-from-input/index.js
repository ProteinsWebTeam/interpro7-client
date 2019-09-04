// @flow
export default (input /*: HTMLInputElement */) => {
  switch (input.type) {
    case 'range':
      return parseFloat(input.value);
    case 'checkbox':
      return input.checked;
    default:
      return input.value;
  }
};
