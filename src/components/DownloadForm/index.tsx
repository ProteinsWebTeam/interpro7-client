import React, { FormEvent, PureComponent, RefObject } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import { set } from 'lodash-es';

import loadData from 'higherOrder/loadData/ts';
import loadable from 'higherOrder/loadable';
import { Params } from 'higherOrder/loadData/extract-params';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { schemaProcessDataPageSection } from 'schema_org/processors';
import { goToCustomLocation } from 'actions/creators';

import DBChoiceInput from './DBChoiceInput';
import ApiLink from './ApiLink';
import TextExplanation from './TextExplanation';
import DataPreviewAndProgressProvider from './DataPreviewAndProgressProvider';
import Estimate from './Estimate';
import Snippet from './Snippet';
import Controls from './Controls';
import ProgressAnimation from './ProgressAnimation';
import FormatSelector from './FormatSelector';
import URLParameters from './URLParameters';

import pathToDescription from 'utils/processDescription/pathToDescription';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { toPublicAPI } from 'utils/url';

import { columns } from 'web-workers/download/object2TSV';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import InputGroup from './InputGroup';

const css = cssBinder(local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type FileTypes = 'fasta' | 'json' | 'accession' | 'tsv' | '';

const extractDataFromHash = (hash: string) => {
  const [path, fileType, subset] = hash
    .replaceAll('%7C', '|')
    .replaceAll('%26', '&')
    .replaceAll('%3F', '?')
    .split('|');
  const validFileTypes = ['fasta', 'json', 'accession', 'tsv'];
  if (!validFileTypes.includes(fileType))
    throw new Error('The filetypoe in the URL is invalid');
  const output: {
    fileType?: FileTypes;
    subset: boolean;
    description?: InterProDescription;
    search?: Record<string, string>;
  } = { fileType: fileType as FileTypes, subset: !!subset };
  const [href, params] = path.split('?');
  try {
    output.description = pathToDescription(href);
    if (params) {
      output.search = Object.fromEntries(
        params.split('&').map((p) => p.split('=')),
      );
    }
  } catch {
    /**/
  }
  return output;
};

type Props = {
  matched: string;
  api?: ParsedURLServer;
  lowGraphics?: boolean;
  customLocation?: InterProLocation;
  goToCustomLocation?: typeof goToCustomLocation;
};

interface LoadedProps extends Props, LoadDataProps<RootAPIPayload> {}

export class DownloadForm extends PureComponent<LoadedProps> {
  _ref: RefObject<HTMLFormElement>;
  memberDB: DBsInfo;

  constructor(props: LoadedProps) {
    super(props);
    this._ref = React.createRef();
    this.memberDB = {};
  }

  /**
   * This method nadles all the changes of the form in a centralized way.
   * The value of all the elements of the form is read, and use to create the hash of the current URL.
   * The URL formed in the hash is the corresponding API call to the selections in the form.
   * @param {Event} event The triggered event
   */
  // eslint-disable-next-line complexity, max-statements
  _handleChange = (event?: FormEvent) => {
    if (!this._ref.current) return;
    const object: {
      description: InterProPartialDescription;
      search?: Record<string, string>;
      subset?: boolean;
      fileType?: string;
    } = {
      description: {},
    };
    const target = event?.target as HTMLElement;
    // Only the add filters buttons trigger this method directly
    if (target instanceof HTMLButtonElement) {
      set(object, target.dataset.key || '', !!target.dataset.value);
      // To remove a filter
      if (!target.dataset.value) {
        for (const input of this._ref.current.querySelectorAll(
          `input[data-reset="${target.dataset.reset}"], input[name="${target.dataset.key}"], select[name="${target.dataset.key}"]`,
        )) {
          (input as HTMLInputElement).value = '';
        }
      }
    }
    for (const element of this._ref.current.elements) {
      const { name, value, type, checked } = element as HTMLInputElement;
      if (name) {
        // Form names use dot notation that correespond to the custom location.
        // e.g description.main.key => {description: {main: {key: value}}}
        set(object, name, type === 'checkbox' ? checked : value);
      }
    }
    if ((target as HTMLSelectElement)?.name === 'description.main.key') {
      // reset the search parameters if there is a change of main type.
      object.search = {};
    }
    // Specific cases
    if (
      object.description.entry &&
      object.description.entry.db === 'interpro'
    ) {
      // remove integration from entry if db is InterPro, because it's useless
      object.description.entry.integration = null;
    }
    // The main cannot be a filter:
    set(
      object.description,
      [object.description.main?.key || '', 'isFilter'],
      null,
    );
    let path;
    const classNames = css('invalid-accession').split(' ');
    try {
      // create a path based in the constructed object
      path = descriptionToPath(object.description);
      target?.classList && target.classList.remove(...classNames);
    } catch {
      target?.classList && target.classList.add(...classNames);
      return;
    }
    if (object.search && Object.keys(object.search).length) {
      // If there are search parameters add them to the URL
      path += `?${Object.entries(object.search)
        .map(([k, v]) => `${k}=${v}`)
        .join('&')}`;
    }
    // More specific cases
    // Subset only available for fasta format, for proteins filtered by an entry
    if (
      object.subset &&
      !(
        object.fileType === 'fasta' &&
        object.description.entry?.isFilter &&
        object.description.entry?.accession
      )
    ) {
      object.subset = false;
    }
    if (
      object.fileType === 'fasta' &&
      object.description.main?.key !== 'protein'
    ) {
      // Since we can only have fasta type for proteins, change type to default
      object.fileType = 'accession';
    }
    if (
      (object.fileType === 'fasta' || object.fileType === 'accession') &&
      object.description.main &&
      !(object.description[object.description.main.key] as EndpointLocation)?.db
    ) {
      // Since we can only have counter objects in JSON, change type to default
      object.fileType = 'json';
    }
    const nextHash = [path, object.fileType, object.subset && 'subset']
      .filter(Boolean)
      .join('|');
    if (nextHash !== this.props.customLocation?.hash) {
      this.props.goToCustomLocation?.({
        ...this.props.customLocation,
        hash: nextHash,
      });
    }
  };

  render() {
    const { matched, api, lowGraphics, data } = this.props;
    if (!data || !api) return null;
    const {
      description,
      search,
      fileType: ft,
      subset,
    } = extractDataFromHash(matched);
    if (!description) return null;

    const fileType = ft || 'json';

    const endpoint = toPublicAPI(
      format({
        protocol: api.protocol,
        hostname: api.hostname,
        port: api.port,
        pathname: (api.root + descriptionToPath(description)).replace(
          /\/+/g,
          '/',
        ),
        query: search,
      }),
    );

    const typeObjects = Object.entries(description).filter(
      ([, ep]) => (ep as EndpointLocation).isFilter !== undefined,
    );

    const filters = typeObjects.filter(
      ([, type]) => (type as EndpointLocation).isFilter,
    );

    const main = description.main.key || 'entry';
    const secondary = filters.length && (filters[0][0] as Endpoint);
    let columnKey =
      secondary && description[secondary].accession
        ? `${main}${secondary[0].toUpperCase()}${secondary.slice(1)}`
        : main;
    // @ts-ignore: Needs to be updated when the object2TSV is migrated
    const endpointColumns = columns[columnKey] || columns[main];

    const path2code = (path: string, varName: string) => {
      const parts = path.split('[*]');
      const selector = parts[0]
        .split(/(\[\d\])/)
        .flatMap((part) => part.split('.'))
        .filter(Boolean)
        .map((part) => (part.startsWith('[') ? part : `["${part}"]`))
        .join('');
      if (parts.length > 1) {
        return `[x${parts[1]} for x in ${varName}${selector}]`;
      }
      return `${varName}${selector}`;
    };
    if (!data?.loading && data?.payload) {
      this.memberDB = data.payload.databases;
    }
    const currentVersion = Number(
      data?.payload?.databases?.interpro?.version || 0,
    );

    const path2perl = (path: string, varName: string) => {
      const parts = path.split('[*]');
      const selector = parts[0]
        .split(/(\[\d\])/)
        .flatMap((part) => part.split('.'))
        .filter(Boolean)
        .map((part) => (part.startsWith('[') ? part : `->{"${part}"}`))
        .join('');
      if (parts.length > 1) {
        return `${parts[1]}, ${varName}${selector}`.replace(/[[]]/g, '');
      }
      return `${varName}${selector}`;
    };

    const mainEndpoint = description[main] as EndpointLocation;

    return (
      <form
        onChange={this._handleChange}
        ref={this._ref}
        className={css('download-form')}
      >
        <h4>Select data</h4>
        <SchemaOrgData
          data={{
            name: 'Download Web from for the InterPro API',
            description:
              'A Webform that allows the user to filter the InterPro dataset to create Download Jobs or scripts',
          }}
          processData={schemaProcessDataPageSection}
        />
        <fieldset className={css('fieldset')}>
          <legend>Main data type</legend>
          <label>
            Choose a main data type:
            <select name="description.main.key" defaultValue={main}>
              {typeObjects.map(([type]) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <DBChoiceInput
            type={main}
            value={(mainEndpoint.db || '').toLowerCase()}
            valueIntegration={(mainEndpoint.integration || '').toLowerCase()}
            name={`description.${main}.db`}
            onClick={this._handleChange}
            databases={this.memberDB}
          />
          <URLParameters
            type={main}
            search={search}
            onChange={this._handleChange}
          />
        </fieldset>
        <fieldset className={css('fieldset')}>
          <legend>Filters</legend>
          <div>
            Add a filter:
            <div className={css('button-group')}>
              {typeObjects
                .filter(
                  ([type]) =>
                    type !== main && !description[type as Endpoint].isFilter,
                )
                .map(([type]) => (
                  <button
                    key={type}
                    type="button"
                    className={css('button')}
                    value={type}
                    data-key={`description.${type}.isFilter`}
                    data-value
                    onClick={this._handleChange}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
            </div>
            <ul className={css('no-bullet')}>
              {filters.map(([key, value]) => (
                <li key={key}>
                  <fieldset className={css('fieldset')}>
                    <legend>{key}</legend>
                    <InputGroup
                      label="filter type:"
                      input={
                        <input
                          type="text"
                          readOnly
                          value={key}
                          name={`description.${key}.isFilter`}
                        />
                      }
                      button={
                        <button
                          type="button"
                          data-key={`description.${key}.isFilter`}
                          className={css('button')}
                          onClick={this._handleChange}
                        >
                          Remove
                        </button>
                      }
                    />
                    <DBChoiceInput
                      type={key}
                      value={(
                        (value as EndpointLocation).db || ''
                      ).toLowerCase()}
                      valueIntegration={(
                        (value as EndpointLocation).integration || ''
                      ).toLowerCase()}
                      name={`description.${key}.db`}
                      onClick={this._handleChange}
                      databases={this.memberDB}
                    />
                    <InputGroup
                      label={`${key} accession:`}
                      input={
                        <input
                          type="text"
                          disabled={!description[key as Endpoint].db}
                          defaultValue={
                            (value as EndpointLocation).accession || ''
                          }
                          name={`description.${key}.accession`}
                          className={css('input-group-field')}
                          data-reset={`description.${key}`}
                        />
                      }
                      button={
                        <button
                          type="button"
                          data-key={`description.${key}.accession`}
                          className={css('button')}
                          onClick={this._handleChange}
                        >
                          Remove
                        </button>
                      }
                    />
                  </fieldset>
                </li>
              ))}
            </ul>
          </div>
        </fieldset>
        <h4>Select Output Format</h4>
        <FormatSelector
          fileType={fileType}
          mainEndpoint={description.main.key as Endpoint}
          hasSelectedDB={!!description?.[description.main.key as Endpoint]?.db}
          hasSelectedAccession={
            !!description?.[description.main.key as Endpoint]?.accession
          }
        />

        <h4>Results</h4>
        <ApiLink url={endpoint} />
        <DataPreviewAndProgressProvider
          url={endpoint}
          fileType={fileType}
          subset={subset}
        >
          {({ data, download, isStale }) => {
            if (!data) return null;
            const count = (data.payload && data.payload.count) || 0;
            const { db, integration } = mainEndpoint;
            const noData = count === 0 && (db !== null || integration !== null);
            return (
              <>
                <Estimate data={data} isStale={isStale} />
                {/* Only display if the response from the API is a list of items */}
                {mainEndpoint.db && !mainEndpoint.accession && (
                  <Snippet
                    fileType={fileType}
                    url={endpoint}
                    subset={subset}
                    columns={endpointColumns.map(
                      (c: { selector: string; selectorInGroup?: string }) =>
                        `${c.selector}${
                          c.selectorInGroup ? `[*]["${c.selectorInGroup}"]` : ''
                        }`,
                    )}
                    path2code={path2code}
                    path2perl={path2perl}
                  />
                )}

                <div>
                  <h4>Download</h4>
                  <TextExplanation
                    fileType={fileType}
                    description={description}
                    subset={subset}
                    isStale={!!isStale}
                    count={count}
                    noData={noData}
                  />
                  <Controls
                    fileType={fileType}
                    subset={subset}
                    entityType={main}
                    url={endpoint}
                    download={download}
                    isStale={isStale}
                    count={count}
                    noData={noData}
                    interProVersion={currentVersion}
                  />
                </div>
                {lowGraphics || <ProgressAnimation download={download} />}
              </>
            );
          }}
        </DataPreviewAndProgressProvider>
      </form>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.settings.ui.lowGraphics,
  (customLocation, api, lowGraphics) => ({ customLocation, api, lowGraphics }),
);

export default loadData({
  getUrl: getUrlForMeta,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as Params)(DownloadForm);
