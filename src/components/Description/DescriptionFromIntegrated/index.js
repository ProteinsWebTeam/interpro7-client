// @flow
import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Literature, {
  getLiteratureIdsFromDescription,
  splitCitations,
} from 'components/Entry/Literature';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Description from 'components/Description';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = foundationPartial(ipro, fonts, local);

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
          Description{' '}
          <Tooltip
            title={`The member database didn't provide a description for this entry. 
                    What is displayed here comes from ${integrated}, the InterPro entry that it has been integrated to.`}
          >
            <span className={css('tag')}>
              <sup>
                <span
                  className={css('icon', 'icon-common', 'icon-info', 'small')}
                  data-icon="&#xf129;"
                />{' '}
              </sup>
              From{' '}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: 'InterPro',
                      accession: integrated,
                    },
                  },
                }}
              >
                {integrated}
              </Link>
            </span>
          </Tooltip>
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
