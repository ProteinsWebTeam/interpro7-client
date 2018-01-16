// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Table, { Column } from 'components/Table';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import ProteinFile from './ProteinFile';
// import Metadata from 'wrappers/Metadata';
// import TaxIdOrName from 'components/Organism/TaxIdOrName';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

const lut = new Map([
  ['3702', { name: 'Arabidopsis thaliana (Mouse-ear cress)' }],
  ['6239', { name: 'Caenorhabditis elegans', icon: 'W' }],
  ['7227', { name: 'Drosophila melanogaster (Fruit fly)', icon: 'F' }],
  ['7739', { name: 'Branchiostoma floridae (Florida lancelet) (Amphioxus)' }],
  ['7955', { name: 'Danio rerio (Zebrafish)', icon: 'Z' }],
  ['8078', { name: 'Fundulus heteroclitus (Killifish) (Mummichog)' }],
  ['8355', { name: 'Xenopus laevis (African clawed frog)', icon: 'f' }],
  ['9031', { name: 'Gallus gallus (Chicken)', icon: 'k' }],
  ['9430', { name: 'Desmodus rotundus (Vampire bat)', icon: '(' }],
  ['9544', { name: 'Macaca mulatta (Rhesus macaque)', icon: 'r' }],
  ['9601', { name: 'Pongo abelii (Sumatran orangutan)', icon: '*' }],
  ['9606', { name: 'Homo sapiens (Human)', icon: 'H' }],
  ['9615', { name: 'Canis lupus familiaris (Dog)', icon: 'd' }],
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
  ['39947', { name: 'Oryza sativa subsp. japonica (Rice)', icon: '6' }],
  ['282301', { name: 'Macrostomum lignano' }],
  [
    '559292',
    {
      name:
        'Saccharomyces cerevisiae (strain ATCC 204508 / S288c) (Baker s yeast)',
      icon: 'Y',
    },
  ],
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
    if (loading) return <Loading />;
    const processed = payloadToProcessed(payload);
    return (
      <div className={f('row')}>
        <div className={f('column')}>
          <Table dataTable={processed}>
            <Column
              dataKey="taxId"
              renderer={taxId => (
                <Link
                  to={{
                    description: {
                      main: { key: 'organism' },
                      organism: { db: 'taxonomy', accession: taxId },
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
                          style={{ fontSize: '200%' }}
                        />
                      )}
                  </span>
                );
              }}
            >
              &nbsp;
            </Column>

            <Column
              dataKey="taxId"
              defaultKey="organism"
              renderer={taxId => {
                const value = lut.get(taxId);
                return (
                  <Link
                    to={{
                      description: {
                        main: { key: 'organism' },
                        organism: { db: 'taxonomy', accession: taxId },
                      },
                    }}
                  >
                    {value && value.icon && <span>{value.name}</span>}
                  </Link>
                );
              }}
            >
              Organism
            </Column>
            <Column dataKey="count" headerClassName={f('table-center')}>
              Protein count
            </Column>
            <Column
              dataKey="taxId"
              defaultKey="proteinFastas"
              headerClassName={f('table-center')}
              renderer={ProteinFastasRenderer}
            >
              FASTA
            </Column>
            <Column
              dataKey="taxId"
              headerClassName={f('table-center')}
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

export default OrganismSubPage;
