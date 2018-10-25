// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Link from 'components/generic/Link';

import { UniProtLink } from 'components/ExtLink';
import DomainsOnProtein from 'components/Related/DomainsOnProtein';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import loadable from 'higherOrder/loadable';
import {
  isTranscribedFrom,
  isContainedInOrganism,
} from 'schema_org/processors';
import Loading from 'components/SimpleCommonComponents/Loading';

const f = foundationPartial(ebiStyles);

/*:: type Props = {
  data: {
    metadata: Object,
  },
  loading: Boolean,
}; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class SummaryProtein extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    loading: T.bool.isRequired,
  };

  render() {
    const { data, loading } = this.props;
    if (loading || !data || !data.metadata) return <Loading />;
    const metadata = data.metadata;
    return (
      <div className={f('sections')}>
        {metadata.gene && (
          <SchemaOrgData
            data={{ gene: metadata.gene }}
            processData={isTranscribedFrom}
          />
        )}
        {metadata.source_organism && (
          <SchemaOrgData
            data={metadata.source_organism}
            processData={isContainedInOrganism}
          />
        )}
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              <table className={f('light', 'table-sum')}>
                <tbody>
                  <tr>
                    <td>Short name</td>
                    <td>
                      <i className={f('shortname')}>{metadata.id}</i>
                    </td>
                  </tr>
                  <tr>
                    <td>Species</td>
                    <td>
                      <Species
                        fullName={metadata.source_organism.fullName}
                        taxID={metadata.source_organism.taxId}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Length</td>
                    <td>
                      <Length metadata={metadata} />
                    </td>
                  </tr>
                  {metadata.proteomes &&
                    metadata.proteomes.length > 0 && (
                      <tr>
                        <td>Proteome</td>
                        <td>
                          <Link
                            to={{
                              description: {
                                main: { key: 'proteome' },
                                proteome: {
                                  db: 'uniprot',
                                  accession: metadata.proteomes[0],
                                },
                              },
                            }}
                          >
                            {metadata.proteomes[0].toUpperCase()}
                          </Link>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    <UniProtLink id={metadata.accession} className={f('ext')}>
                      View {metadata.accession.toUpperCase()} in UniProtKB
                    </UniProtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className={f('row')}>
            <div className={f('medium-12', 'columns', 'margin-bottom-large')}>
              <DomainsOnProtein mainData={data} />
            </div>
          </div>
        </section>
        <GoTerms terms={metadata.go_terms} type="protein" />
      </div>
    );
  }
}

export default SummaryProtein;
