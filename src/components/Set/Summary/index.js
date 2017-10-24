// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Accession from 'components/Accession';
import Title from 'components/Title';
import Description from 'components/Description';
import {BaseLink} from 'components/ExtLink';

import f from 'styles/foundation';

/*:: type Props = {
  data: {
    metadata: Object,
  },
  currentSet: Object
}; */

class SummarySet extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    currentSet: T.object,
  };

  render() {
    const { data: { metadata }, currentSet } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType={'set'} />
              <div className={f('tag', 'margin-bottom-medium')}>
                {metadata.source_database}
              </div>
              <Accession accession={metadata.accession} id={metadata.id} />
              <Description
                heightToHide={106}
                textBlocks={[metadata.description]}
              />

            </div>
            <div className={f('medium-2', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    {currentSet ?
                      <BaseLink
                        id={metadata.accession}
                        target="_blank"
                        pattern={currentSet.url_template}
                      >
                        See this set in {currentSet.name}
                      </BaseLink> : null
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default SummarySet;
