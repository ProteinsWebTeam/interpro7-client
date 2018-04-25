import parseParamToNumber from '.';

describe('parseParamToNumber', () => {
  const parseTestToNumber = parseParamToNumber('test');

  test('given a parameter name it returns a function', () => {
    expect(parseTestToNumber).toBeInstanceOf(Function);
  });

  test('should not modify a non-target parameter', () => {
    const obj1 = { a: 1, b: 'b' };
    const obj1Parsed = parseTestToNumber(obj1);
    expect(obj1Parsed.a).toBe(obj1.a);
    expect(obj1Parsed.b).toBe(obj1.b);
  });

  test('should parse a target parameter', () => {
    const obj1 = { a: 1, test: '2' };
    const obj1Parsed = parseTestToNumber(obj1);
    expect(obj1Parsed.a).toBe(obj1.a);
    expect(obj1Parsed.test).toBe(2);
  });

  test('should be pure', () => {
    const obj1 = {};
    const obj1Parsed = parseTestToNumber(obj1);
    expect(obj1Parsed).toEqual(obj1);
    expect(obj1Parsed).not.toBe(obj1);
    const obj2 = { test: '3' };
    const obj2Parsed = parseTestToNumber(obj2);
    expect(obj2Parsed).not.toBe(obj2);
    const obj3 = { a: '3' };
    const obj3Parsed = parseTestToNumber(obj3);
    expect(obj3Parsed).toEqual(obj3);
    expect(obj3Parsed).not.toBe(obj3);
  });
});
