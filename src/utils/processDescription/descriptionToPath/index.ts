import descriptionToDescription from 'utils/processDescription/descriptionToDescription';

/*:: import type { Description } from 'utils/processDescription/handlers'; */

type PathValues =
  | {
      [key: string]: string | boolean | number | null; // All objects except for "others"
    }
  | string[]; // "others"

// prettier-ignore
const pathForPart = (
  type: string,
  values: PathValues
)/*: string */ => [type, ...Object.values(values)]
  .filter(part => typeof part === 'string').join('/');

export default (description: InterProPartialDescription | undefined) => {
  const _description = descriptionToDescription(description);
  let output = '/';
  if (!_description.main.key) {
    const others = Object.values(_description.other).filter(Boolean);
    if (!others.length) return output;
    return `${output}${others.join('/')}/`;
  }

  const main = _description.main.key;
  output += `${pathForPart(main, _description[main])}/`;
  const filters = Object.entries(_description)
    .filter(([, entry]) => (entry as EndpointPartialLocation).isFilter)
    .sort(([, entryA], [, entryB]) => {
      let a = (entryA as EndpointPartialLocation).order;
      let b = (entryB as EndpointPartialLocation).order;

      if (a == undefined) a = 0;
      if (b == undefined) b = 0;

      return a > b ? 1 : -1;
    });

  return filters.reduce(
    (acc, [key, values]) => `${acc}${pathForPart(key, values)}/`,
    output,
  );
};
