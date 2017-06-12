// @flow
import React, {PureComponent} from 'react';
import T from 'prop-types';
import Title from 'components/Title';
import {PDBeLink} from 'components/ExtLink';
import Embed from 'components/Embed';

import f from 'styles/foundation';
import pdbLogo from 'images/pdbe.png';

const embedStyle = {width: '100%', height: '50vh'};

class SummaryStructure extends PureComponent {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    location: T.shape({
      pathname: T.string.isRequired,
    }).isRequired,
  };

  render() {
    const {data: {metadata}, location: {pathname}} = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              <Title metadata={metadata} pathname={pathname} />
              <h4>Summary</h4>
              <pdb-prints size="48">
                <pdb-data-loader pdbid={metadata.accession} />
              </pdb-prints>
              {
                metadata.chains &&
                <div>
                  <h4>Chains:</h4>
                  { metadata.chains.join(', ') }
                </div>
              }
            </div>
            <div className={f('medium-4', 'large-4', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('chevron')}>
                  <li>
                    <PDBeLink id={metadata.accession}>
                      <img src={pdbLogo} alt="Uniprot logo" />
                    </PDBeLink>
                  </li>
                </ul>
                {/* <PDBe3DLink id={metadata.accession}>*/}
                {/* <img*/}
                {/* src={`//www.ebi.ac.uk/pdbe/static/entry/${*/}
                {/* metadata.accession.toLowerCase()*/}
                {/* }_entity_1_front_image-400x400.png`}*/}
                {/* alt="structure image"*/}
                {/* style={{maxWidth: '100%'}}*/}
                {/* />*/}
                {/* </PDBe3DLink>*/}
              </div>
            </div>
          </div>
          <Embed
            style={embedStyle}
            src={
              `https://www.ebi.ac.uk/pdbe/entry/view3D/${
                metadata.accession
              }/?view=entry_index&viewer=jmol&controls=codename_hero`
            }
          >
            <div
              style={{
                background: 'white',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={`//www.ebi.ac.uk/pdbe/static/entry/${
                  metadata.accession.toLowerCase()
                }_entity_1_front_image-400x400.png`}
                alt="structure image"
                style={{maxWidth: '100%'}}
              />
            </div>
          </Embed>
        </section>
      </div>
    );
  }
}

export default SummaryStructure;
