// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import Accession from 'components/Accession';
import Description from 'components/Description';
import { BaseLink } from 'components/ExtLink';

import ClanViewer from 'clanviewer';
import 'clanviewer/css/clanviewer.css';

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
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
  };

  componentDidMount() {
    const rootDiv = document.getElementById('clanviewer');
    this._vis = new ClanViewer({ element: rootDiv });
    const data = this.props.data.metadata.relationships;
    this._vis.paint(data, false);
    rootDiv.addEventListener('click', e => {
      const g = e.path[1];
      if (g.nodeName === 'g' && g.classList.contains('node')) {
        this.props.goToCustomLocation({
          description: {
            main: { key: 'entry' },
            entry: {
              db: this.props.customLocation.description.mainDB,
              accession: g.getAttribute('data-accession'),
            },
          },
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const data = nextProps.data.metadata.relationships;
      this._vis.paint(data, false);
    }
  }

  render() {
    const { data: { metadata }, currentSet } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              {
                // <div className={f('tag', 'margin-bottom-medium')}>
                // {metadata.source_database}
                // </div>
              }
              <p>
                <Accession accession={metadata.accession} id={metadata.id} />
              </p>
              <h4>Description</h4>
              <Description textBlocks={[metadata.description]} />
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    {currentSet ? (
                      <BaseLink
                        id={metadata.accession}
                        className={f('ext')}
                        target="_blank"
                        pattern={currentSet.url_template}
                      >
                        View this set in {currentSet.name}
                      </BaseLink>
                    ) : null}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={f('row', 'columns')}>
            <div id="clanviewer" />
          </div>
        </section>
      </div>
    );
  }
}

export default connect(null, { goToCustomLocation })(SummarySet);
