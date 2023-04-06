import classNames from 'classnames/bind';

export default (...cssModules: Array<Record<string, string>>) => {
  const output: Record<string, string> = {};
  for (const style of cssModules) {
    for (const [rule, hash] of Object.entries(style) /*: any */) {
      if (output[rule]) {
        if (!output[rule].split(' ').includes(hash)) output[rule] += ` ${hash}`;
      } else {
        output[rule] = `${rule} ${hash}`;
      }
    }
  }

  return classNames.bind(output);
};
