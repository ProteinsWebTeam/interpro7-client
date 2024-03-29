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

const _getOrdinal = (d: number) => {
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

export const formatISODate = (date: string) => {
  const d = new Date(date);
  return `${_getOrdinal(d.getDate())} ${
    monthNames[d.getMonth()]
  } ${d.getFullYear()}`;
};

export const formatLongDate = (d: Date) =>
  `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

export const formatShortDate = (d: Date) =>
  `${(d.getDate() < 10 ? '0' : '') + d.getDate()}/${
    (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1)
  }/${d.getFullYear()}`;

export const formatLongDateTime = (d: Date) =>
  `${(d.getDate() < 10 ? '0' : '') + d.getDate()}-${
    (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1)
  }-${d.getFullYear()} ${(d.getHours() < 10 ? '0' : '') + d.getHours()}:${
    (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
  }:${(d.getSeconds() < 10 ? '0' : '') + d.getSeconds()}`;
