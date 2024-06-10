import { checkLines, cleanUpBlocks } from '.';
import { MAX_NUMBER_OF_SEQUENCES } from '..';

const seq = `
>testing
tgcatgcatgtca
gcatgcat`;

const invalidCharactersIssue = {
  type: 'invalidCharacters',
  detail: 'Invalid characters',
  header: '>testing',
};
const tooShortIssue = {
  type: 'tooShort',
  header: '',
};
const tooManyIssue = {
  type: 'tooMany',
};
const duplicateHeaderIssue = {
  type: 'duplicatedHeaders',
  header: '> testing',
};
describe('areAllCharacterValid()', () => {
  test('valid text', () => {
    expect(checkLines(seq.split('\n'))).toEqual([]);
  });

  test('other char', () => {
    expect(checkLines(`${seq}4`.split('\n'))).toMatchObject([
      invalidCharactersIssue,
    ]);
    expect(checkLines(`${seq}-`.split('\n'))).toMatchObject([
      invalidCharactersIssue,
    ]);
    expect(checkLines(`${seq}.`.split('\n'))).toMatchObject([
      invalidCharactersIssue,
    ]);
  });

  test('too short', () => {
    expect(checkLines(['A'])).toMatchObject([tooShortIssue]);
    tooShortIssue.header = '> another seq';
    expect(
      checkLines([...seq.split('\n'), '> another seq', 'A']),
    ).toMatchObject([tooShortIssue]);
    expect(
      checkLines([
        ...seq.split('\n'),
        ...seq.replace('>', '> 2').split('\n'),
        '> another seq',
        'A',
        ...seq.replace('>', '> 4').split('\n'),
      ]),
    ).toMatchObject([tooShortIssue]);
  });

  test('Max number of sequences', () => {
    let seqs = '';
    for (let i = 0; i < MAX_NUMBER_OF_SEQUENCES; i++)
      seqs += `${seq.replace('>', `> ${i}`)}\n`;
    expect(checkLines(seqs.split('\n'))).toEqual([]);
    expect(checkLines(`${seqs}${seq}`.split('\n'))).toMatchObject([
      tooManyIssue,
    ]);
  });
  test('hasDuplicateHeaders', () => {
    expect(checkLines(`${seq}`.split('\n'))).toEqual([]);
    expect(checkLines(`${seq}${seq}`.split('\n'))).toMatchObject([
      duplicateHeaderIssue,
    ]);
    expect(checkLines(`${seq}${seq}${seq}`.split('\n'))).toMatchObject([
      duplicateHeaderIssue,
      duplicateHeaderIssue,
    ]);
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
