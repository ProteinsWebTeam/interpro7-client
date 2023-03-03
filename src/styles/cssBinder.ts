import classNames from 'classnames/bind';

export default (
  cssModule: Record<string, string>,
  ...otherCssModules: Array<Record<string, string>>
) => {
  const output = cssModule;
  for (const style of otherCssModules) {
    for (const [rule, hash] of Object.entries(style) /*: any */) {
      if (output[rule]) {
        if (!output[rule].split(' ').includes(hash)) output[rule] += ` ${hash}`;
      } else {
        output[rule] = hash;
      }
    }
  }

  return classNames.bind(output);
};
