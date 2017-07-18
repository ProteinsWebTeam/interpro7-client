import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import Table, { Column } from 'components/Table';
import Link from 'components/generic/Link';
import ProgressButton from 'components/ProgressButton';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { foundationPartial } from 'styles/foundation';

import fonts from 'styles/ebi/fonts.css';

const f = foundationPartial(fonts);

const lut = new Map([
  ['6239', { name: 'Caenorhabditis elegans', icon: 'W' }],
  ['7227', { name: 'Drosophila melanogaster (Fruit fly)', icon: 'F' }],
  ['7739', { name: 'Branchiostoma floridae (Florida lancelet) (Amphioxus)' }],
  ['7955', { name: 'Danio rerio (Zebrafish)', icon: 'Z' }],
  ['8078', { name: 'Fundulus heteroclitus (Killifish) (Mummichog)' }],
  ['8355', { name: 'Xenopus laevis (African clawed frog)', icon: 'f' }],
  ['9544', { name: 'Macaca mulatta (Rhesus macaque)', icon: 'r' }],
  ['9606', { name: 'Homo sapiens (Human)', icon: 'H' }],
  ['9823', { name: 'Sus scrofa (Pig)', icon: 'p' }],
  ['9913', { name: 'Bos taurus (Bovine)', icon: 'C' }],
  ['10090', { name: 'Mus musculus (Mouse)', icon: 'M' }],
  ['10116', { name: 'Rattus norvegicus (Rat)', icon: 'R' }],
  [
    '31033',
    {
      name: 'Takifugu rubripes (Japanese pufferfish) (Fugu rubripes)',
      icon: 'E',
    },
  ],
  ['35525', { name: 'Daphnia magna' }],
  ['282301', { name: 'Macrostomum lignano' }],
]);

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainAccession,
  accession => ({ accession }),
);

const mapStateToUrlForProteinIDsFor = createSelector(
  taxId => taxId,
  taxId =>
    createSelector(
      state => state.settings.api,
      state => state.newLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        const _description = {
          mainType: 'protein',
          // TODO: change when 'uniprot' will work on the API
          mainDB: 'UniProt',
          focusType: description.mainType,
          focusDB: description.mainDB,
          focusAccession: description.mainAccession,
        };
        return `${protocol}//${hostname}:${port}${root}${description2path(
          _description,
        )}?${qsStringify({ tax_id: taxId, page_size: 300 })}`.replace(
          /\?$/,
          '',
        );
      },
    ),
);

const payloadToFastaBlobUrl = createSelector(
  payload => payload.results,
  results =>
    URL.createObjectURL(
      new Blob(
        [
          results
            .map(r => `>${r.metadata.accession}\n  ...sequence`)
            .join('\n'),
        ],
        { type: 'text/x-fasta' },
      ),
    ),
);

const ProteinFastas = connect(
  mapStateToProps,
)(({ accession, taxId, data: { loading, payload } }) => {
  if (loading || !payload) return null;
  return (
    <a
      download={`${accession}-${taxId}.fasta`}
      href={payloadToFastaBlobUrl(payload)}
      className={f('icon', 'icon-functional')}
      data-icon="S"
      title={`FASTA file for ${accession} for tax ID ${taxId}`}
    />
  );
});

const getWorker = () =>
  import('webWorkers/proteinFile/index.worker.js').then(Worker => new Worker());

class _ProteinFile extends PureComponent {
  static propTypes = {
    description: T.object.isRequired,
    api: T.object.isRequired,
    taxId: T.string.isRequired,
    type: T.string.isRequired,
  };

  _workerMessage = ({ data: { type, details } }) => {
    switch (type) {
      case 'progress':
        this.setState({ progress: details });
        return;
      case 'failed':
        console.error(details);
        this.setState({ failed: true });
        return;
      case 'success':
        this.setState({ downloading: false });
        if (this._anchor) {
          this._anchor.href = details;
        }
        return;
    }
  };

  _handleClick = e => {
    if (this._anchor && this._anchor.href) return;
    e.preventDefault();
    if (this.state.downloading || this.state.failed) return;
    this.setState({ downloading: true });
    getWorker().then(worker => {
      this._worker = worker;
      this._worker.addEventListener('message', this._workerMessage);
      const { description, api, taxId } = this.props;
      this._worker.postMessage({
        description,
        api,
        taxId,
        type: this.props.type,
      });
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      downloading: false,
      failed: false,
      progress: 0,
    };
  }

  componentWillUnmount() {
    if (this._anchor && this._anchor.href) {
      URL.revokeObjectURL(this._anchor.href);
    }
    if (this._worker) {
      this._worker.removeEventListener('message', this._workerMessage);
      if ('terminate' in this._worker) this._worker.terminate();
    }
  }

  render() {
    const { taxId, description: { mainAccession }, type } = this.props;
    return (
      <a
        ref={node => (this._anchor = node)}
        // download={`${mainAccession}-${taxId}.txt`}
        target="_blank"
        title={`${type === 'FASTA'
          ? 'FASTA file'
          : 'Protein accessions'} for ${mainAccession} for tax ID ${taxId}`}
        onClick={this._handleClick}
      >
        <ProgressButton {...this.state} />
      </a>
    );
  }
}

const mapStateToProps2 = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  (api, description) => ({ api, description }),
);
const ProteinFile = connect(mapStateToProps2)(_ProteinFile);

const ProteinAccessionsRenderer = taxId =>
  <ProteinFile taxId={taxId} type="accession" />;

const ProteinFastasRenderer = taxId =>
  <ProteinFile taxId={taxId} type="FASTA" />;

const payloadToProcessed = createSelector(
  payload => payload,
  payload =>
    Object.entries(payload || {})
      .map(([taxId, count]) => ({ taxId, count }))
      .sort(({ count: a }, { count: b }) => b - a),
);

class SpeciesSub extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading) return <span>Loading...</span>;
    const processed = payloadToProcessed(payload);
    return (
      <div className={f('row')}>
        <div className={f('column')}>
          <Table dataTable={processed} pathname={''}>
            <Column
              accessKey="taxId"
              renderer={taxId =>
                <Link href={`http://www.uniprot.org/taxonomy/${taxId}`}>
                  {taxId}
                </Link>}
            >
              Tax ID
            </Column>
            <Column
              accessKey="taxId"
              defaultKey="organism"
              renderer={taxId => {
                const value = lut.get(taxId);
                if (!value) return null;
                return (
                  <span>
                    {value.icon &&
                      <span
                        className={f('icon', 'icon-species')}
                        data-icon={value.icon}
                      />}
                    &nbsp;
                    {value.name}
                  </span>
                );
              }}
            >
              Organism
            </Column>
            <Column accessKey="count">Protein count</Column>
            <Column
              accessKey="taxId"
              defaultKey="proteinFastas"
              renderer={ProteinFastasRenderer}
            >
              FASTA
            </Column>
            <Column
              accessKey="taxId"
              defaultKey="proteinAccessions"
              renderer={ProteinAccessionsRenderer}
            >
              Protein accessions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const _description = {
      mainType: 'protein',
      mainDB: 'uniprot',
      focusType: description.mainType,
      focusDB: description.mainDB,
      focusAccession: description.mainAccession,
    };
    return `${protocol}//${hostname}:${port}${root}${description2path(
      _description,
    )}?${qsStringify({ group_by: 'tax_id' })}`;
  },
);

export default loadData(mapStateToUrl)(SpeciesSub);
