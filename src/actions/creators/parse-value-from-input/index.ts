export default (input: HTMLInputElement | HTMLSelectElement) => {
  switch (input.type) {
    case 'range':
      return parseFloat(input.value);
    case 'checkbox':
      return (input as HTMLInputElement).checked;
    default:
      return input.value;
  }
};
