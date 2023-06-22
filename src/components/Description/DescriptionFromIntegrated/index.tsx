import React, { useEffect } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Literature, {
  getLiteratureIdsFromDescription,
  splitCitations,
} from 'components/Entry/Literature';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Description from 'components/Description';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(ipro, local, fonts);

const ImportedTag = ({ accession }: { accession: string }) => {
  return (
    <Tooltip
      title={`The member database didn't provide a description for this signature. 
            The description displayed has been imported from ${accession}, the InterPro entry in which the signature is integrated.`}
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
                accession,
              },
            },
          }}
        >
          {accession}
        </Link>
      </span>
    </Tooltip>
  );
};

type Props = {
  integrated: string | null;
  setIntegratedCitations?: (citations: string[]) => void;
};

interface IntegratedProps
  extends Props,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const DescriptionFromIntegrated = ({
  integrated,
  data,
  setIntegratedCitations = (_: string[]) => null,
}: IntegratedProps) => {
  const { loading, payload } = data || {};
  useEffect(() => {
    setIntegratedCitations(Object.keys(payload?.metadata?.literature || {}));
  }, [payload?.metadata?.literature]);
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
          Description <ImportedTag accession={integrated} />
        </h4>
        <Description
          textBlocks={payload.metadata.description}
          literature={included}
          accession={payload.metadata.accession}
        />
        <h4>
          References <ImportedTag accession={integrated} />
        </h4>
        <Literature included={included} extra={extra} />
      </>
    );
  }
  return null;
};

const getUrlFor = createSelector(
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
