// @flow

const blueIcon = / (4932|4894|2157|2|10239|4751) /;
const greenIcon = / (3702|4527|4575|49274|4512|3700|3603|1462606|33090) /;

export default (lineage /*: string */) => {
  if (blueIcon.test(lineage)) return '#5bc0de';
  if (greenIcon.test(lineage)) return '#5cb85c';
};
