// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import Table, { Column } from 'components/Table';
import Link from 'components/generic/Link';
import ProteinFile from './ProteinFile';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

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

const ProteinAccessionsRenderer = taxId => (
  <ProteinFile taxId={taxId} type="accession" />
);

const ProteinFastasRenderer = taxId => (
  <ProteinFile taxId={taxId} type="FASTA" />
);

const payloadToProcessed = createSelector(
  payload => payload,
  (payload /*: ?{|[key: string]: number |} */) =>
    Object.entries(payload || {})
      .map(([taxId, count]) => ({ taxId, count }))
      .sort(({ count: a }, { count: b }) => +b - +a),
);

/*:: type Props = {
  data: {
    loading: boolean,
    payload: ?Object,
  }
}; */

class OrganismSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { data: { loading, payload } } = this.props;
    if (loading)
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading… </div>
        </div>
      );
    const processed = payloadToProcessed(payload);
    return (
      <div className={f('row')}>
        <div className={f('column')}>
          <Table dataTable={processed} pathname={''}>
            <Column
              dataKey="taxId"
              renderer={taxId => (
                <Link
                  newTo={{
                    description: {
                      mainType: 'organism',
                      mainDB: 'taxonomy',
                      mainAccession: taxId,
                    },
                  }}
                >
                  {taxId}
                </Link>
              )}
            >
              Tax ID
            </Column>
            <Column
              dataKey="taxId"
              defaultKey="organism"
              renderer={taxId => {
                const value = lut.get(taxId);
                return (
                  <span>
                    {value &&
                      value.icon && (
                        <span
                          className={f('icon', 'icon-species')}
                          data-icon={value.icon}
                          title={value.name}
                        />
                      )}
                    &nbsp;
                    <Metadata
                      endpoint="organism"
                      db="taxonomy"
                      accession={taxId}
                    >
                      <TaxIdOrName accession={taxId} />
                    </Metadata>
                  </span>
                );
              }}
            >
              Organism
            </Column>
            <Column dataKey="count" className={f('table-center')}>
              Protein count
            </Column>
            <Column
              dataKey="taxId"
              defaultKey="proteinFastas"
              className={f('table-center')}
              renderer={ProteinFastasRenderer}
            >
              FASTA
            </Column>
            <Column
              dataKey="taxId"
              className={f('table-center')}
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
      mainDB: 'UniProt',
      focusType: description.mainType,
      focusDB: description.mainDB,
      focusAccession: description.mainAccession,
    };
    return `${protocol}//${hostname}:${port}${root}${description2path(
      _description,
    )}?${qsStringify({ group_by: 'tax_id' })}`;
  },
);

export default loadData(mapStateToUrl)(OrganismSubPage);
