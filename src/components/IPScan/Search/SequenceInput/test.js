import {
  areAllCharacterValid,
  isTooShort,
  cleanUpBlocks,
  hasTooManySequences,
  hasDuplicateHeaders,
} from '.';
import { MAX_NUMBER_OF_SEQUENCES } from '..';

const seq = `
>testing
tgcatgcatgtca
gcatgcat`;

describe('areAllCharacterValid()', () => {
  test('valid text', () => {
    expect(areAllCharacterValid(seq.split('\n')).result).toEqual(true);
    expect(isTooShort(seq.split('\n')).result).toEqual(false);
  });

  test('other char', () => {
    expect(areAllCharacterValid(`${seq}4`.split('\n')).result).toEqual(false);
    expect(areAllCharacterValid(`${seq}-`.split('\n')).result).toEqual(false);
    expect(areAllCharacterValid(`${seq}.`.split('\n')).result).toEqual(false);
    expect(isTooShort(`${seq}4`.split('\n')).result).toEqual(false);
  });

  test('too short', () => {
    expect(areAllCharacterValid(['A']).result).toEqual(true);
    expect(isTooShort(['A']).result).toEqual(true);
    expect(
      isTooShort([...seq.split('\n'), '> another seq', 'A']).result,
    ).toEqual(true);
    expect(
      isTooShort([
        ...seq.split('\n'),
        ...seq.split('\n'),
        '> another seq',
        'A',
        ...seq.split('\n'),
      ]).result,
    ).toEqual(true);
  });

  test('Max number of sequences', () => {
    let seqs = '';
    for (let i = 0; i < MAX_NUMBER_OF_SEQUENCES; i++) seqs += `${seq}\n`;
    expect(areAllCharacterValid(seqs.split('\n')).result).toEqual(true);
    expect(hasTooManySequences(seqs.split('\n')).result).toEqual(false);
    expect(areAllCharacterValid(`${seqs}${seq}`.split('\n')).result).toEqual(
      true,
    );
    expect(hasTooManySequences(`${seqs}${seq}`.split('\n')).result).toEqual(
      true,
    );
  });
  test('hasDuplicateHeaders', () => {
    expect(hasDuplicateHeaders(`${seq}`.split('\n')).result).toEqual(false);
    expect(hasDuplicateHeaders(`${seq}${seq}`.split('\n')).result).toEqual(
      true,
    );
    expect(
      hasDuplicateHeaders(`${seq}${seq}${seq}`.split('\n')).result,
    ).toEqual(true);
  });
});

describe('clenUp()', () => {
  test('already clean text', () => {
    expect(cleanUpBlocks(seq.split('\n').map((l) => ({ text: l })))).toEqual(
      seq.trim(),
    );
  });
  test('cleaning other chars', () => {
    expect(
      cleanUpBlocks(`${seq}41$9{-.`.split('\n').map((l) => ({ text: l }))),
    ).toEqual(seq.trim());
  });
  test('double headers', () => {
    expect(
      cleanUpBlocks(
        `${seq}\n> double header${seq}${seq}`
          .split('\n')
          .map((l) => ({ text: l })),
      ),
    ).toMatchSnapshot();
    expect(
      cleanUpBlocks(
        `${seq}\n;comment\n> double header\n;comment${seq}${seq}`
          .split('\n')
          .map((l) => ({ text: l })),
      ),
    ).toMatchSnapshot();
  });
});
