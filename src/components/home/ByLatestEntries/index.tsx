import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import EntryCard from 'components/home/EntryCard';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './styles.css';

const css = cssBinder(fonts, local);

/*:: type EntriesProps = {
  data: {
    payload: Object
  }
}*/

interface LoadedProps
  extends LoadDataProps<
    PayloadList<{
      metadata: EntryMetadata;
      extra_fields: {
        counters: MetadataCounters;
      };
    }>
  > {}

export const ByLatestEntries = ({ data }: LoadedProps) => {
  if (!data || !data.ok) return null;
  if (data.loading) return <Loading />;
  const entriesToDisplayCount = 7;
  if (data.payload) {
    const newEntries = data.payload.results.slice(0, entriesToDisplayCount);
    return (
      <div className={css('feat-entry-list')}>
        <div className={css('vf-stack', 'vf-stack--200')}>
          <AnimatedEntry className={css('wrapper')} element="div">
            {newEntries.map((e) => (
              <EntryCard entry={e} key={e.metadata.accession} />
            ))}
          </AnimatedEntry>
          <div>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: 'InterPro' },
                } as InterProPartialDescription,
                search: { latest_entries: '' },
              }}
              buttonType="primary"
            >
              View all new entries
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

const getAllLatestEntriesURL = createSelector(
  (state: GlobalState) => state.settings.api,
  ({ protocol, hostname, port, root }) => {
    const desc: InterProPartialDescription = {
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

export default loadData(getAllLatestEntriesURL as LoadDataParameters)(
  ByLatestEntries,
);
