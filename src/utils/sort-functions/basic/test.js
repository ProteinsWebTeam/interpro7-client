import sortFn from '.';

describe('sort-basic', () => {
  let array;

  test('basic string', () => {
    array = ['bravo', 'alpha', 'beta'];
    array.sort(sortFn());
    expect(array).toEqual(['alpha', 'beta', 'bravo']);
    array.sort(sortFn({ descending: true }));
    expect(array).toEqual(['bravo', 'beta', 'alpha']);
  });

  test('basic number', () => {
    array = [1, 10, 5, 50, 2];
    array.sort(sortFn());
    expect(array).toEqual([1, 2, 5, 10, 50]);
    array.sort(sortFn({ descending: true }));
    expect(array).toEqual([50, 10, 5, 2, 1]);
  });

  test('selector string', () => {
    array = [{ a: 'z' }, { a: 'a', b: 'b' }, { a: 'l' }];
    array.sort(sortFn({ selector: item => item.a }));
    expect(array).toEqual([{ a: 'a', b: 'b' }, { a: 'l' }, { a: 'z' }]);
    array.sort(sortFn({ selector: item => item.a, descending: true }));
    expect(array).toEqual([{ a: 'z' }, { a: 'l' }, { a: 'a', b: 'b' }]);
  });

  test('selector number', () => {
    array = [{ a: 10 }, { a: 4, b: 'b' }, { a: 1 }];
    array.sort(sortFn({ selector: item => item.a }));
    expect(array).toEqual([{ a: 1 }, { a: 4, b: 'b' }, { a: 10 }]);
    array.sort(sortFn({ selector: item => item.a, descending: true }));
    expect(array).toEqual([{ a: 10 }, { a: 4, b: 'b' }, { a: 1 }]);
  });
});
