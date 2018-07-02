// @flow
import getAbbr from '../get-abbr';

export default (
  value /*:: ?: ?(number | string) */,
  abbr /*:: ?: boolean */,
  scaleMargin /*:: ?: number */,
) => {
  if (!value && value !== 0) return;
  let _value = Math.round(+value);
  if (isNaN(_value)) return 'N/A';
  if (Number.isFinite(_value)) {
    if (abbr) {
      _value = getAbbr(_value, scaleMargin);
    } else {
      // this will print the number according to locale preference
      // like a coma as thousand-separator in english
      if (Number.isFinite(_value)) _value = _value.toLocaleString();
    }
  }
  return _value;
};
