import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Literature, {
  getLiteratureIdsFromDescription,
  splitCitations,
} from 'components/Entry/Literature';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Description from 'components/Description';
import { Params } from 'src/higherOrder/loadData/extract-params';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(ipro, local, fonts);

type Props = {
  integrated: string | null;
};

interface IntegratedProps
  extends Props,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const DescriptionFromIntegrated = ({
  integrated,
  data: { loading, payload },
}: IntegratedProps) => {
  if (!integrated) return null;
  if (loading) return <Loading />;

  if (payload?.metadata?.description?.length) {
    const citations = getLiteratureIdsFromDescription(
      payload.metadata.description
    );
    const [included, extra] = splitCitations(
      payload.metadata.literature,
      citations
    );

    return (
      <>
        <h4>
          Description{' '}
          <Tooltip
            title={`The member database didn't provide a description for this signature. 
                    The description displayed has been imported from ${integrated}, the InterPro entry in which the signature is integrated.`}
          >
            <span className={css('tag')}>
              <sup>
                <span
                  className={css('icon', 'icon-common', 'icon-info', 'small')}
                  data-icon="&#xf129;"
                />{' '}
              </sup>
              Imported from{' '}
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

const getUrlFor: GetUrl<Props> = createSelector(
  (state: GlobalState) => state.settings.api,
  (_state: GlobalState, props?: Props) => props?.integrated || '',
  (server: ParsedURLServer, accession: string) => {
    if (!accession) return null;
    const { protocol, hostname, port, root } = server;
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
  }
);

export default loadData(getUrlFor as Params)(DescriptionFromIntegrated);
