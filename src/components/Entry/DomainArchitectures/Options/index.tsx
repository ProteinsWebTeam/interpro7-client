import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { changeSettingsRaw } from 'actions/creators';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ToggleSwitch from 'components/ToggleSwitch';
import Exporter from 'components/Table/Exporter';

import ExternalExportButton from 'components/Table/Exporter/ExternalExportButton';
import AllIDADownload from './AllIDADownload';

import cssBinder from 'styles/cssBinder';

import exporterStyle from 'components/Table/Exporter/style.css';
import local from './style.css';
import { toPublicAPI } from 'utils/url';

const css = cssBinder(local, exporterStyle);

type PropsIDAOptions = {
  changeSettingsRaw: typeof changeSettingsRaw;
  idaAccessionDB: string;
  showDBSelector?: boolean;
  showExporter?: boolean;
  api?: ParsedURLServer;
  entryLocation?: EndpointLocation;
  search?: InterProLocationSearch;
  count?: number;
};
const IDAOptions = ({
  changeSettingsRaw,
  idaAccessionDB,
  api,
  count = 0,
  showDBSelector = true,
  showExporter = true,
  search,
  entryLocation,
}: PropsIDAOptions) => {
  const toggleDomainEntry = () => {
    changeSettingsRaw(
      'ui',
      'idaAccessionDB',
      idaAccessionDB === 'pfam' ? 'interpro' : 'pfam',
    );
  };

  return (
    <nav className={css('options-panel')}>
      {showDBSelector && (
        <div className={css('accession-selector-panel')}>
          <label>
            Database:{' '}
            <Tooltip title="Switch between domain architectures based on Pfam and InterPro entries">
              <ToggleSwitch
                switchCond={idaAccessionDB === 'pfam'}
                name={'accessionDB'}
                id={'accessionDB-input'}
                SRLabel={'Use accessions from'}
                onValue={'Pfam'}
                offValue={'InterPro'}
                handleChange={toggleDomainEntry}
                addAccessionStyle={true}
              />
            </Tooltip>
          </label>
        </div>
      )}
      {showExporter && (
        <Exporter includeSettings={false}>
          <div className={css('menu-grid')}>
            <AllIDADownload count={count} fileType="json" />
            <AllIDADownload count={count} fileType="tsv" />
            {api && (
              <ExternalExportButton
                type={'api'}
                url={toPublicAPI(getAPIURL(api, entryLocation, search))}
              />
            )}
          </div>
        </Exporter>
      )}
    </nav>
  );
};

const getAPIURL = (
  { protocol, hostname, port, root }: ParsedURLServer,
  entryLocation?: EndpointLocation,
  search?: InterProLocationSearch,
) => {
  const description: InterProPartialDescription = {
    main: { key: 'entry' },
    entry: {
      ...(entryLocation || {}),
      detail: undefined,
    },
  };
  return format({
    protocol,
    hostname,
    port,
    pathname: root + descriptionToPath(description),
    query: entryLocation?.accession ? { ida: '' } : search,
  });
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) =>
    state.customLocation.description.entry as EndpointLocation,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.ui,
  (api, entryLocation, search, { idaAccessionDB }) => ({
    api,
    entryLocation,
    search,
    idaAccessionDB,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(IDAOptions);
