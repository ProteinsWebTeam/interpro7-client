import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import EntryCard from 'components/home/EntryCard';
import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';
import Loading from 'components/SimpleCommonComponents/Loading';

const f = foundationPartial(ebiGlobalStyles, fonts, theme, local);

/*:: type EntriesProps = {
  data: {
    payload: Object
  }
}*/

export class ByLatestEntries extends PureComponent /*:: <EntriesProps> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    const entriesToDisplayCount = 7;
    if (this.props.data && this.props.data.payload) {
      const newEntries = this.props.data.payload.results.slice(
        0,
        entriesToDisplayCount,
      );
      return (
        <div className={f('feat-entry-list')}>
          <div className={f('row')}>
            <div className={f('columns')}>
              <AnimatedEntry className={f('card-wrapper')} element="div">
                {newEntries.map((e) => (
                  <EntryCard entry={e} key={e.metadata.accession} />
                ))}
              </AnimatedEntry>
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro' },
                  },
                  search: { latest_entries: '' },
                }}
                className={f('button', 'margin-bottom-none')}
              >
                View all latest entries
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <Loading />;
  }
}

const getAllLatestEntriesURL = createSelector(
  (state) => state.settings.api,
  ({ protocol, hostname, port, root }) => {
    const desc = {
      main: { key: 'entry' },
      entry: { db: 'interpro' },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(desc),
      query: {
        latest_entries: '',
        extra_fields: 'counters',
      },
    });
  },
);

export default loadData(getAllLatestEntriesURL)(ByLatestEntries);
