import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import IsoformSelector from 'components/Protein/Isoforms/Selector';
import IsoformViewer from 'components/Protein/Isoforms/Viewer';
import Loading from 'components/SimpleCommonComponents/Loading';

type Props = {
  data: RequestedData<MetadataPayload<ProteinMetadata>>;
  isoform?: string;
};

const IsoformSubPage = ({ data, isoform }: Props) => {
  if (!data || data.loading || !data.payload?.metadata) return <Loading />;

  return (
    <div>
      <IsoformSelector />
      {isoform && <IsoformViewer protein={data.payload.metadata} />}
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  ({ isoform }) => ({ isoform: isoform as string | undefined }),
);

export default connect(mapStateToProps)(IsoformSubPage);
