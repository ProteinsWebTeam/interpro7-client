// @flow
const UNITS = ['', 'k', 'M', 'G'];
const UNIT_SCALE = 1000; // Jump scale every 1000 jump in magnitude

export default (value /*: number */, scaleMargin /*:: ?: number */ = 1) => {
  let _value = value;
  let unitIndex = 0;
  while (_value >= UNIT_SCALE * scaleMargin) {
    unitIndex++;
    _value = Math.round(_value / UNIT_SCALE);
  }
  return `${_value.toLocaleString()}${UNITS[unitIndex]}`;
};
