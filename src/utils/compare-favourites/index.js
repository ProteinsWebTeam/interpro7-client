import getTableAccess, { FavEntries } from 'storage/idb';
import { createNotification } from 'utils/browser-notifications';
import id from 'utils/cheap-unique-id';
import { isEqual, sortBy, noop, transform, isObject } from 'lodash-es';

import config from 'config';

const objToString = (obj, depth) => {
  if (obj === null) return String(obj);
  switch (typeof obj) {
    case 'string':
      return obj;
    case 'object':
      // eslint-disable-next-line no-case-declarations
      const indent = Array(depth || 1).join('\t');
      return `${Object.keys(obj)
        .map((key) => {
          let prop = '';
          if (isNaN(Number(key)))
            prop = `${key.charAt(0).toUpperCase() + key.slice(1)}: `;
          return `\n\t${indent}${prop}${objToString(
            obj[key],
            (depth || 1) + 1,
          )}`;
        })
        .join('')}\n${indent}`;
    default:
      return obj.toString();
  }
};

const difference = (object, base) => {
  if (
    typeof object === 'string' &&
    typeof base === 'string' &&
    !isEqual(object, base)
  )
    return object;

  return transform(object, (result, value, key) => {
    if (!isEqual(value, base[key])) {
      result[key] =
        isObject(value) && isObject(base[key])
          ? difference(value, base[key])
          : value;
    }
  });
};

const compare = (stored, fetched) => {
  const keys = [
    'type',
    'name',
    'description',
    'member_databases',
    'literature',
    'go_terms',
  ];
  const old = [];
  const newData = [];

  // // TODO to be removed. For testing purpose
  stored.type = 'kjdk';
  stored.name.name = 'dfidshf';
  stored.name.short = 'sdf';
  stored.description[0] = 'dfidshf';
  stored.member_databases.prints = {
    PR00545: 'Refu',
  };
  stored.literature.PUB00015853 = {
    PMID: 147476,
    authors: ['Schwabe JW', 'Teichmann SA.'],
    volume: '2004',
    issue: '217',
    year: 2004,
    title: 'Nuclear receptors: the evolution of diversity.',
    URL: null,
    raw_pages: 'pe4',
    medline_journal: 'Sci STKE',
    ISO_journal: 'Sci. STKE',
    DOI_URL: 'http://dx.doi.org/10.1126/stke.2172004pe4',
  };
  stored.go_terms = [
    {
      identifier: 'GO:0003677',
      name: 'DNA binding',
      category: {
        code: 'F',
        name: 'molecular_function',
      },
    },
    {
      identifier: 'GO:0003707',
      name: 'steroid hormone receptor activity',
      category: {
        code: 'F',
        name: 'molecular_function',
      },
    },
    {
      identifier: 'GO:0008270',
      name: 'zinc ion binding',
      category: {
        code: 'F',
        name: 'molecular_function',
      },
    },
    {
      identifier: 'GO:0006355',
      name: 'regulation of transcription, DNA-templated',
      category: {
        code: 'P',
        name: 'biological_process',
      },
    },
    {
      identifier: 'GO:0005634',
      name: 'jsdf',
      category: {
        code: 'C',
        name: 'cellular_component',
      },
    },
  ];

  if (stored.literature) {
    Object.entries(stored.literature).forEach(([key, value]) => {
      stored.literature[key] = { ...value, authors: value.authors.sort() };
    });
  }
  if (fetched.literature) {
    Object.entries(fetched.literature).forEach(([key, value]) => {
      fetched.literature[key] = { ...value, authors: value.authors.sort() };
    });
  }
  if (stored.go_terms) stored.go_terms = sortBy(stored.go_terms, 'identifier');
  if (fetched.go_terms)
    fetched.go_terms = sortBy(fetched.go_terms, 'identifier');

  keys.forEach((k) => {
    const key = k.charAt(0).toUpperCase() + k.slice(1);
    const diffInSaved = difference(stored[k], fetched[k]);
    const diffInFetched = difference(fetched[k], stored[k]);
    if (Object.keys(diffInSaved).length > 0)
      old.push(`${key}: ${objToString(diffInSaved)}`);
    if (Object.keys(diffInFetched).length > 0)
      newData.push(`${key}: ${objToString(diffInFetched)}`);
  });
  if (old.length > 0 || newData.length > 0)
    return { old: old, newData: newData };
  return {};
};

export const getMismatchedFavourites = async ({
  notify = false,
  addToast = noop,
  setChangedFav = noop,
  setLoading = noop,
}) => {
  const favTable = await getTableAccess(FavEntries);
  const storedContent = await favTable.getAll();
  const entries = Object.entries(storedContent);
  const changedEntries = [];

  entries.forEach(([key, value], index) => {
    fetch(`${config.root.API.href}entry/interpro/${key}`).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          const differences = compare(value.metadata, json.metadata);
          if (Object.keys(differences).length > 0) {
            changedEntries.push({
              accession: key,
              differences: differences,
              latest: json,
            });
          } else {
            setLoading(false);
          }

          if (changedEntries.length > 0 && index === entries.length - 1) {
            setChangedFav(changedEntries);
            setLoading(false);

            if (notify) {
              const notification = createNotification(
                'InterPro',
                'Changes detected in your favourites',
              );
              notification.onclick = () => {
                window.open(
                  `${window.location.origin}/interpro/fav-updates/`,
                  '_blank',
                );
              };

              addToast(
                {
                  title: 'Favourites update',
                  body:
                    'Changed detected in your favourites in the new version',
                  ttl: 10000, // eslint-disable-line no-magic-numbers
                  link: {
                    to: {
                      description: { other: ['fav-updates'] },
                    },
                    children: 'See the difference',
                  },
                },
                id(),
              );
            }
          }
        });
      }
    });
  });
};
