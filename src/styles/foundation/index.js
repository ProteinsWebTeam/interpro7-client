// @flow
import classNames from 'classnames/bind';
// foundation.css is the most up-to date
// import foundation from 'foundation-sites/dist/css/foundation.css';
// import foundation from 'foundation-sites/dist/css/foundation-float.css';
import foundation from 'foundation-sites/dist/css/foundation-float.css';
/**
 * Use the default when only foundation is required
 * @example
 * import f from 'styles/foundation';
 * // And in the JSX
 * <div className={f('row')}>
 */
export default classNames.bind(foundation);

/**
 * If multiple css need to be bound, use this function, which needs to be
 * called from the file where it is used. e.g.
 * @example
 * import s from './other_style.css';
 * const f_and_s = foundationPartial(s);
 * // And in the JSX. th class row comes from foundation and the custom
 * // comes from other_style.css
 * <div className={f_and_s('row', 'custom')}>
 * @param {object} otherStyles other css that have been imported in the file.
 * @returns {object} a classNames object that can be used to define classes
 */
export const foundationPartial = (
  ...otherStyles /*: Array<typeof foundation> */
) => {
  const output = {};
  for (const style of [foundation, ...otherStyles]) {
    for (const [rule, hash] of (Object.entries(style) /*: any */)) {
      if (output[rule]) {
        output[rule] += ` ${hash}`;
      } else {
        output[rule] = hash;
      }
    }
  }
  return classNames.bind(output);
};
