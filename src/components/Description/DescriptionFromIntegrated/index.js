import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Literature, {
  getLiteratureIdsFromDescription,
  splitCitations,
} from 'components/Entry/Literature';

import Loading from 'components/SimpleCommonComponents/Loading';
import Description from 'components/Description';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const css = foundationPartial(ipro, local);

const DescriptionFromIntegrated = ({
  integrated,
  data: { loading, payload },
}) => {
  if (!integrated) return null;
  if (loading) return <Loading />;

  if (payload?.metadata?.description?.length) {
    const citations = getLiteratureIdsFromDescription(
      payload.metadata.description,
    );
    const [included, extra] = splitCitations(
      payload.metadata.literature,
      citations,
    );

    return (
      <>
        <h4>
          Description <span className={css('tag')}>From {integrated}</span>
        </h4>
        <Description
          textBlocks={payload.metadata.description}
          literature={included}
          accession={payload.metadata.accession}
        />
        <h4>References</h4>
        <Literature included={included} extra={extra} />
      </>
    );
  }
  return null;
};

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (_state, props) => props.integrated,
  ({ protocol, hostname, port, root }, accession) => {
    if (!accession) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'entry' },
          entry: { db: 'interpro', accession },
        }),
    });
  },
);

export default loadData(getUrlFor)(DescriptionFromIntegrated);
