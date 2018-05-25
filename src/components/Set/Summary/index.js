import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Accession from 'components/Accession';
import Description from 'components/Description';
import { BaseLink } from 'components/ExtLink';

import Loading from 'components/SimpleCommonComponents/Loading';
import ClanViewer from 'clanviewer';
import 'clanviewer/css/clanviewer.css';

import f from 'styles/foundation';
import loadable from 'higherOrder/loadable';
import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

/*:: type Props = {
  data: {
    metadata: Object,
  },
  db: string,
  currentSet: Object
}; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const schemaProcessData = ({ data: { accession, score }, db }) => ({
  '@id': '@contains', // maybe 'is member of' http://semanticscience.org/resource/SIO_000095
  name: 'entry',
  value: {
    '@type': ['Entry', 'StructuredValue', 'BioChemEntity'],
    name: accession,
    score,
    url:
      config.root.website.protocol +
      config.root.website.href +
      descriptionToPath({
        main: { key: 'entry' },
        entry: { db, accession },
      }),
  },
});

class SummarySet extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    db: T.string.isRequired,
    currentSet: T.object,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
    loading: T.bool,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    if (!this._ref.current) return;
    this._vis = new ClanViewer({ element: this._ref.current });
    const data = (this.props.data &&
      this.props.data.metadata &&
      this.props.data.metadata.relationships) || {
      nodes: [],
      relationships: [],
    };
    this._vis.paint(data, false);
    this._ref.current.addEventListener('click', this._handleClick);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const data = this.props.data.metadata.relationships;
      this._vis.paint(data, false);
    }
  }

  componentWillUnmount() {
    if (this._ref.current) {
      this._ref.current.removeEventListener('click', this._handleClick);
    }
  }

  _handleClick = event => {
    const g = event.path[1];
    if (g.nodeName === 'g' && g.classList.contains('node')) {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'entry' },
          entry: { db: this.props.db, accession: g.dataset.accession },
        },
      });
    }
  };

  render() {
    const metadata =
      this.props.loading || !this.props.data.metadata
        ? {
            accession: '',
            description: '',
            id: '',
          }
        : this.props.data.metadata;
    const { currentSet } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              <Accession accession={metadata.accession} id={metadata.id} />
              <h4>Description</h4>
              <Description
                textBlocks={[metadata.description]}
                accession={metadata.accession}
              />
              {metadata.relationships &&
                metadata.relationships.nodes &&
                metadata.relationships.nodes.map(m => (
                  <SchemaOrgData
                    key={m.accession}
                    data={{ data: m, db: metadata.source_database }}
                    processData={schemaProcessData}
                  />
                ))}
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
            <div ref={this._ref} />
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.set.db,
  db => ({ db }),
);

export default connect(mapStateToProps, { goToCustomLocation })(SummarySet);
