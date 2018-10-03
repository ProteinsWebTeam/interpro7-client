/* eslint-disable no-magic-numbers */
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const _getOrdinal = d => {
  if (d > 3 && d < 21) return `${d}th`;
  switch (d % 10) {
    case 1:
      return `${d}st`;
    case 2:
      return `${d}nd`;
    case 3:
      return `${d}rd`;
    default:
      return `${d}th`;
  }
};

export const formatISODate = date => {
  const d = new Date(date);
  return `${_getOrdinal(d.getDay())} ${
    monthNames[d.getMonth()]
  } ${d.getFullYear()}`;
};
