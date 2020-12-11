import React, { useEffect, useState } from 'react';
import { getMismatchedFavourites } from 'utils/compare-favourites';
import getTableAccess, { FavEntries } from 'storage/idb';

import ReactDiffViewer from 'react-diff-viewer';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, ipro, fonts);

const updateIDB = (id, content, changedFav, setChangedFav) => {
  getTableAccess(FavEntries).then((favT) => {
    // Updating in IDB
    favT.update(id, (prev) => ({ ...prev, ...content }));

    const list = changedFav.filter((fav) => fav.accession !== id);
    setChangedFav(list);
  });
};

const FavouriteUpdates = () => {
  const [changedFav, setChangedFav] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMismatchedFavourites({
      setChangedFav: setChangedFav,
      setLoading: setLoading,
    });
  }, []);

  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <section>
          {loading && <h2>Looking for changes in your favourite entries</h2>}
          {!loading && changedFav.length === 0 && (
            <h2>All your favourites are up to date</h2>
          )}
          {changedFav.length > 0 && (
            <>
              {changedFav.map((fav) => (
                <div key={fav.accession}>
                  <div className={f('row')}>
                    <div className={f('medium-3', 'column')}>
                      <h3>Entry: {fav.accession}</h3>
                    </div>
                    <div className={f('medium-2', 'column')}>
                      <button
                        className={f('button', 'icon', 'icon-common')}
                        data-icon="&#x7d;"
                        onClick={() =>
                          updateIDB(
                            fav.accession,
                            fav.latest,
                            changedFav,
                            setChangedFav,
                          )
                        }
                      >
                        {' '}
                        Update
                      </button>
                    </div>
                  </div>
                  <ReactDiffViewer
                    // oldValue={JSON.stringify(fav.differences.old)}
                    oldValue={fav.differences.old.join('\n')}
                    // newValue={JSON.stringify(fav.differences.newData)}
                    newValue={fav.differences.newData.join('\n')}
                    splitView={true}
                    leftTitle={'Saved'}
                    rightTitle={'Latest'}
                    hideLineNumbers={true}
                  />
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default FavouriteUpdates;
