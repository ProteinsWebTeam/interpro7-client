import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { changeSettingsRaw } from 'actions/creators';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ToggleSwitch from 'components/ToggleSwitch';
import Exporter from 'components/Table/Exporter';
import APIViewButton from 'components/Table/Exporter/APIViewButton';
import AllIDADownload from './AllIDADownload';

import cssBinder from 'styles/cssBinder';

import exporterStyle from 'components/Table/Exporter/style.css';
import local from './style.css';

const css = cssBinder(local, exporterStyle);

type PropsIDAOptions = {
  changeSettingsRaw: typeof changeSettingsRaw;
  idaAccessionDB: string;
  api?: ParsedURLServer;
  search?: Record<string, string | boolean>;
};
const IDAOptions = ({
  changeSettingsRaw,
  idaAccessionDB,
  api,
  search,
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
      {search && (
        <Exporter>
          <div className={css('menu-grid')}>
            <label htmlFor="json">JSON</label>
            <AllIDADownload
              search={search as Record<string, string>}
              count={10}
              fileType="json"
            />
            <label htmlFor="json">TSV</label>
            <AllIDADownload
              search={search as Record<string, string>}
              count={10}
              fileType="tsv"
            />
            <label htmlFor="api">API</label>
            {api && <APIViewButton url={getAPIURL(api, search)} />}
          </div>
        </Exporter>
      )}
    </nav>
  );
};
const getAPIURL = (
  { protocol, hostname, port, root }: ParsedURLServer,
  search: Record<string, string | boolean>,
) => {
  const description = {
    main: { key: 'entry' },
  };
  // build URL
  return format({
    protocol,
    hostname,
    port,
    pathname: root + descriptionToPath(description),
    query: search,
  });
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.ui,
  (api, search, { idaAccessionDB }) => ({
    api,
    search,
    idaAccessionDB,
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(IDAOptions);
