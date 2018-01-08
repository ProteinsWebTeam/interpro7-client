// @flow
import parseValueFromInput from '.';

describe('action creator helper function to extract value from input', () => {
  let input;

  beforeEach(() => (input = document.createElement('input')));

  test('should extract value from "range" input', () => {
    input.type = 'range';
    input.value = '1.56';
    const value = parseValueFromInput(input);
    expect(value).toBe(1.56); // eslint-disable-line no-magic-numbers
  });

  test('should extract value from "checkbox" input', () => {
    input.type = 'checkbox';
    const value = parseValueFromInput(input);
    expect(value).toBe(false);
  });

  test('should extract value from "text" input', () => {
    input.type = 'text';
    input.value = '1.56';
    const value = parseValueFromInput(input);
    expect(value).toBe('1.56');
  });

  test('should extract value from untyped input (defaults to text)', () => {
    input.value = '1.56';
    const value = parseValueFromInput(input);
    expect(value).toBe('1.56');
  });
});
