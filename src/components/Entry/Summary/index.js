// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import Title from 'components/Title';
import InterProHierarchy from 'components/Entry/InterProHierarchy';

import f from 'styles/foundation';

/* :: type Props = {
    data: {
      metadata: {
        accession: string,
        name: {name: string, short: ?string},
        source_database: string,
        type: string,
        gene?: string,
        experiment_type?: string,
        source_organism?: Object,
        release_date?: string,
        chains?: Array<string>,
        integrated: string,
        member_databases?: Object,
        go_terms: Object,
        description: Array<string>,
        literature: Object,
      }
    },
    location: {description: {mainType: string}},
  };
*/

class SummaryEntry extends PureComponent /*:: <Props> */ {
  propTypes = {
    goToNewLocation: T.func.isRequired,
    data: T.shape({
      metadata: T.object.isRequired,
    }),
    location: T.shape({
      description: T.shape({
        mainAccession: T.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const {
      data: { metadata },
      location: { description: { mainType } },
    } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              <Title metadata={metadata} mainType={mainType} />
              {metadata.hierarchy && (
                <InterProHierarchy
                  accession={metadata.accession}
                  hierarchy={metadata.hierarchy}
                />
              )}
              {// doesn't work for some HAMAP as they have enpty <P> tag
              Object.keys(metadata.description).length > 0 && (
                <Description
                  textBlocks={metadata.description}
                  literature={metadata.literature}
                />
              )}
            </div>
            <div className={f('medium-4', 'large-4', 'columns')}>
              {metadata.integrated && (
                <div className={f('panel')}>
                  <Integration intr={metadata.integrated} />
                </div>
              )}
              {metadata.integrated && (
                <div className={f('panel')}>
                  <h5>External links</h5>
                  {
                    // TODO implement right MD ext link
                  }
                  <Link
                    className={f('ext')}
                    newTo={{
                      description: {},
                    }}
                  >
                    {metadata.source_database} website
                  </Link>
                </div>
              )}
              {metadata.member_databases &&
                Object.keys(metadata.member_databases).length > 0 && (
                  <div className={f('panel')}>
                    <ContributingSignatures contr={metadata.member_databases} />
                  </div>
                )}
            </div>
          </div>
        </section>
        {Object.keys(metadata.go_terms) &&
        metadata.source_database !== 'InterPro' ? null : (
          <GoTerms
            terms={metadata.go_terms}
            type="entry"
            db={metadata.source_database}
          />
        )}
        {Object.keys(metadata.literature).length > 0 && (
          <section id="references">
            <div className={f('row')}>
              <div className={f('large-12', 'columns')}>
                <h4>References</h4>
              </div>
            </div>
            <Literature
              references={metadata.literature}
              description={metadata.description}
            />
          </section>
        )}

        {Object.keys(metadata.cross_references || {}).length > 0 && (
          <section id="cross_references">
            <div className={f('row')}>
              <div className={f('large-12', 'columns')}>
                <h4>Cross References</h4>
              </div>
            </div>
            <CrossReferences xRefs={metadata.cross_references} />
          </section>
        )}
      </div>
    );
  }
}

export default SummaryEntry;
