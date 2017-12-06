// @flow
import descriptionToDescription from 'utils/processDescription/descriptionToDescription';

/*:: import type { Description } from 'utils/processDescription/handlers'; */

// prettier-ignore
const pathForPart = (
  type/*: string */,
  values/*: {|[key: string]: ?(string | boolean)|} */
)/*: string */ => [type, ...Object.values(values)]
  .filter(part => typeof part === 'string').join('/');

export default (description /*: Description */) => {
  const _description = descriptionToDescription(description);
  let output = '/';
  if (!_description.main.key) {
    return (
      output +
      Object.values(_description.other)
        .filter(Boolean)
        .join('/')
    );
  }
  const main = _description.main.key;
  output += `${pathForPart(main, _description[main])}/`;
  const filters = Object.entries(_description).filter(
    ([, { isFilter }]) => isFilter,
  );
  return filters.reduce(
    (acc, [key, values]) => `${output}${pathForPart(key, values)}/`,
    output,
  );
};
