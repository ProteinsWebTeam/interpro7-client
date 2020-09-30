import React, { PureComponent } from 'react';
import getTableAccess, { FavEntries } from 'storage/idb';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import EntryCard from 'components/home/EntryCard';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import cardStyle from '../ByLatestEntries/styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, cardStyle);

/*:: type Props = {
  entries: Array<string>,
}; */

/*:: type State = {
  fav: Array<Object>,
}; */

export class FavouriteEntries extends PureComponent /*:: <Props> */ {
  static propTypes = {
    entries: T.array.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      fav: [],
    };
  }

  componentDidMount() {
    this.getFavourites();
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (prevProps.entries.length !== this.props.entries.length)
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
    this.setState({ fav: entryStructureModified });
  };

  render() {
    if (this.state.fav.length > 0) {
      return (
        <div className={f('feat-entry-list')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <AnimatedEntry className={f('card-wrapper')} element="div">
                {this.state.fav.map((f) => (
                  <EntryCard entry={f} key={f.metadata.accession} />
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
const mapStateToProps = createSelector(
  (state) => state.favourites.entries,
  (entries) => ({ entries }),
);

export default connect(mapStateToProps)(FavouriteEntries);
