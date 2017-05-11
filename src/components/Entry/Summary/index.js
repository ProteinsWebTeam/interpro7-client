import React, {Component} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import {goToLocation} from 'actions/creators';

import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import Title from 'components/Title';

import f from 'styles/foundation';
import loadWebComponent from 'utils/loadWebComponent';
const webComponents = [];

class SummaryEntry extends Component {
  /* ::
   props: {
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
     location: {pathname: string},
   };
  */
  componentWillMount() {
    const interproComponents = import(
      /* webpackChunkName: "interpro-components" */'interpro-components'
    );
    webComponents.push(loadWebComponent(
      () => interproComponents.then(m => m.InterproHierarchy),
    ).as('interpro-hierarchy'));
    webComponents.push(loadWebComponent(
      () => interproComponents.then(m => m.InterproEntry),
    ).as('interpro-entry'));
    webComponents.push(loadWebComponent(
      () => interproComponents.then(m => m.InterproType),
    ).as('interpro-type'));
  }

  async componentDidMount() {
    await Promise.all(webComponents);
    const h = this.props.data.metadata.hierarchy;
    if (h) this._hierarchy.hierarchy = h;
    this._hierarchy.addEventListener('click', e => {
      if (e.path[0].classList.contains('link')){
        e.preventDefault();
        this.props.goToLocation(e.path[0].getAttribute('href'));
      }
    });
  }

  render() {
    const {data: {metadata}, location: {pathname}} = this.props;
    return (
        <div className={f('sections')}>
          <section>
            <div className={f('row')}>
              <div className={f('medium-8', 'large-8', 'columns')}>
                <Title metadata={metadata} pathname={pathname}/>
                <interpro-hierarchy
                  accession={metadata.accession}
                  hideafter="2"
                  hrefroot="/entry/interpro"
                  ref={(node) => this._hierarchy = node}
                />
                <br/>
                <Description
                  textBlocks={metadata.description}
                  literature={metadata.literature}
                />
              </div>
              <div className={f('medium-4', 'large-4', 'columns')}>
                {
                  metadata.integrated &&
                  <div className={f('panel')}>
                    <Integration
                      intr={metadata.integrated}
                      pathname={pathname}
                    />
                  </div>
                }
                {
                  metadata.member_databases &&
                  Object.keys(metadata.member_databases).length > 0 &&
                  <div className={f('panel')}>
                    <ContributingSignatures
                      contr={metadata.member_databases}
                      pathname={pathname}
                    />
                  </div>
                }
              </div>
            </div>
          </section>
          {
            Object.keys(metadata.literature).length > 0 &&
            <section id="references">
              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <h4>References</h4>
                </div>
              </div>
              <Literature references={metadata.literature}/>
            </section>
          }
          {
            Object.keys(metadata.go_terms) &&
            <GoTerms terms={metadata.go_terms}/>
          }
        </div>
    );
  }
}

SummaryEntry.propTypes = {
  goToLocation: T.func.isRequired,
  data: T.shape({
    metadata: T.object.isRequired,
  }),
  location: T.shape({
    pathname: T.string.isRequired,
  }).isRequired,
};

export default connect(null, {goToLocation})(SummaryEntry);
