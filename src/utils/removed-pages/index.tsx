import Link from 'components/generic/Link';
import React, { ReactElement } from 'react';

export const removedPages: Array<{
  description: InterProPartialDescription;
  getMessage: (location: InterProPartialDescription) => ReactElement;
}> = [
  {
    description: {
      main: { key: 'set' },
      set: { detail: 'alignments' },
    },
    getMessage: () => {
      return (
        <>Profile-profile alignments have been removed in InterPro 97.0.</>
      );
    },
  },
  {
    description: {
      main: { key: 'entry' },
      entry: { detail: 'rosettafold' },
    },
    getMessage: (location) => {
      return (
        <>
          RosseTTaFold models have been removed in InterPro 96.0. You can use{' '}
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  ...location.entry,
                  detail: 'alphafold',
                },
              },
            }}
          >
            AlphaFold models
          </Link>{' '}
          instead.
        </>
      );
    },
  },

  {
    description: {
      main: { key: 'entry' },
      entry: { detail: 'curation' },
    },
    getMessage: (location) => {
      return (
        <>
          The curation information has been moved to the{' '}
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  ...location.entry,
                  detail: '',
                },
              },
            }}
          >
            Overview
          </Link>{' '}
          section
        </>
      );
    },
  },

  {
    description: {
      main: { key: 'entry' },
      entry: { detail: 'genome3d' },
    },
    getMessage: (location) => {
      return (
        <>
          Genome3D models have been removed in InterPro 98.0. You can use{' '}
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  ...location.entry,
                  detail: 'alphafold',
                },
              },
            }}
          >
            AlphaFold models
          </Link>{' '}
          instead.
        </>
      );
    },
  },
];

const isObject = (item: unknown): boolean =>
  typeof item === 'object' && item !== null && !Array.isArray(item);

export const doesObjectFits = (
  object: Record<string, unknown>,
  template: Record<string, unknown>,
): boolean => {
  for (const [key, value] of Object.entries(template)) {
    if (key in object) {
      if (Array.isArray(value) && Array.isArray(object[key])) {
        if (!doesArrayFits(object[key] as Array<unknown>, value)) return false;
      } else if (isObject(value) && isObject(object[key])) {
        if (
          !doesObjectFits(
            object[key] as Record<string, unknown>,
            value as Record<string, unknown>,
          )
        )
          return false;
      } else {
        if (value !== object[key]) return false;
      }
    } else {
      return false;
    }
  }
  return true;
};
export const doesArrayFits = (
  array: Array<unknown>,
  template: Array<unknown>,
): boolean => {
  for (let i = 0; i < template.length; i++) {
    if (Array.isArray(template[i]) && Array.isArray(array[i])) {
      if (
        !doesArrayFits(
          array[i] as Array<unknown>,
          template[i] as Array<unknown>,
        )
      )
        return false;
    } else if (isObject(template[i]) && isObject(array[i])) {
      if (
        !doesObjectFits(
          array[i] as Record<string, unknown>,
          template[i] as Record<string, unknown>,
        )
      )
        return false;
    } else {
      if (template[i] !== array[i]) return false;
    }
  }
  return true;
};

export const getMessageIfLocationRemoved = (
  location: InterProDescription,
): ReactElement | null => {
  for (const page of removedPages) {
    if (doesObjectFits(location, page.description)) {
      return page.getMessage(location);
    }
  }
  return null;
};
