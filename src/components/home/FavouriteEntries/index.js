import React, { PureComponent } from 'react';
import getTableAccess, { FavEntries } from 'storage/idb';

import AnimatedEntry from 'components/AnimatedEntry';
import EntryCard from 'components/home/EntryCard';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import cardStyle from '../ByLatestEntries/styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, cardStyle);

export class ByFavouriteEntries extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
    };
  }

  componentDidMount() {
    this.getFavourites();
  }

  componentDidUpdate() {
    this.getFavourites();
  }

  getFavourites = async () => {
    const favTA = await getTableAccess(FavEntries);
    const content = await favTA.getAll();
    const entries = Object.values(content);
    const entryStructureModified = entries.map((e) => {
      e.metadata.name = e.metadata.name.name;
      e.extra_fields = {};
      e.extra_fields.counters = e.metadata.counters;
      return e;
    });
    this.setState({ entries: entryStructureModified });
  };

  render() {
    if (this.state.entries.length > 0) {
      return (
        <div className={f('feat-entry-list')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <AnimatedEntry className={f('card-wrapper')} element="div">
                {this.state.entries.map((e) => (
                  <EntryCard entry={e} key={e.metadata.accession} />
                ))}
              </AnimatedEntry>
            </div>
          </div>
        </div>
      );
    }
    return <div>No Favourites are saved.</div>;
  }
}

export default ByFavouriteEntries;
