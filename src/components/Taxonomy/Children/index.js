import React, { PureComponent } from 'react';
import T from 'prop-types';

import TaxIdOrName from 'components/Taxonomy/TaxIdOrName';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import loadable from 'higherOrder/loadable';
import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const f = foundationPartial(local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
const schemaProcessData = ({ taxId, name }) => ({
  '@id': '@contains', // maybe 'is member of' http://semanticscience.org/resource/SIO_000095
  name: 'contains',
  value: {
    '@type': ['Taxonomy', 'StructuredValue', 'BioChemEntity'],
    name,
    identifier: taxId,
    url:
      config.root.website.protocol +
      config.root.website.href +
      descriptionToPath({
        main: { key: 'taxonomy' },
        taxonomy: { db: 'uniprot', accession: taxId },
      }),
  },
});
class Children extends PureComponent {
  static propTypes = {
    taxChildren: T.array.isRequired,
    names: T.object,
  };

  render() {
    const { taxChildren, names } = this.props;
    return (
      <div className={f('list-children')}>
        {taxChildren.length ? (
          taxChildren.map(taxId => (
            <div key={taxId}>
              <TaxIdOrName accession={taxId} name={names[taxId]} />
              <SchemaOrgData
                data={{ taxId, name: names[taxId] }}
                processData={schemaProcessData}
              />
            </div>
          ))
        ) : (
          <span>None</span>
        )}
      </div>
    );
  }
}

export default Children;
