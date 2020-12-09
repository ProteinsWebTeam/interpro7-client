import getTableAccess, { FavEntries } from 'storage/idb';
import { createNotification } from 'utils/browser-notifications';
import id from 'utils/cheap-unique-id';
import { isEqual, sortBy, noop } from 'lodash-es';

import config from 'config';

const compare = (stored, fetched) => {
  const keys = [
    'type',
    'name',
    'description',
    'member_databases',
    'literature',
    'go_terms',
  ];
  const oldObj = {};
  const newObj = {};
  keys.forEach((k) => {
    // TODO to be removed. For testing purpose
    stored['type'] = 'kjdk';
    stored['name'].name = 'dfidshf';
    stored['description'][0] = 'dfidshf';
    stored['member_databases'].prints = {};

    if (
      ['name', 'type', 'description', 'member_databases'].includes(k) &&
      !isEqual(stored[k], fetched[k])
    ) {
      oldObj[k] = stored[k];
      newObj[k] = fetched[k];
    }

    if (k === 'literature') {
      Object.entries(stored[k]).forEach(([key, value]) => {
        stored[k][key] = { ...value, authors: value.authors.sort() };
      });
      Object.entries(fetched[k]).forEach(([key, value]) => {
        fetched[k][key] = { ...value, authors: value.authors.sort() };
      });
      if (!isEqual(stored[k], fetched[k])) {
        oldObj[k] = stored[k];
        newObj[k] = fetched[k];
      }
    }

    if (k === 'go_terms') {
      if (
        !isEqual(
          sortBy(stored[k], 'identifier'),
          sortBy(fetched[k], 'identifier'),
        )
      ) {
        oldObj[k] = stored[k];
        newObj[k] = fetched[k];
      }
    }
  });
  return { old: oldObj, newData: newObj };
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
