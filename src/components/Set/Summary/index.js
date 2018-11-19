import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Accession from 'components/Accession';
import Description from 'components/Description';
import { BaseLink } from 'components/ExtLink';

import ClanViewer from 'clanviewer';
import 'clanviewer/css/clanviewer.css';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

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
      metadata: T.object,
    }).isRequired,
    db: T.string.isRequired,
    currentSet: T.object,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
    loading: T.bool.isRequired,
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
    // TODO: Update clanviewer to clean SVG
    this._vis._ro.disconnect();
    this._vis.tick = null;
    this._vis = null;
    this._ref = null;
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
              <table className={f('light', 'table-sum')}>
                <tbody>
                  <tr>
                    <td>Accession</td>
                    <td>
                      <Accession accession={metadata.accession} />
                    </td>
                  </tr>
                  <tr>
                    <td>Data type</td>
                    <td>Set</td>
                  </tr>
                  <tr>
                    <td style={{ width: '200px' }}>Member database</td>
                    <td className={f('text-up')}>{metadata.source_database}</td>
                  </tr>
                </tbody>
              </table>
              {metadata.description && (
                <>
                  <h4>Description</h4>
                  <Description
                    textBlocks={[metadata.description]}
                    accession={metadata.accession}
                  />
                </>
              )}
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
            {currentSet ? (
              <div className={f('medium-3', 'columns')}>
                <div className={f('panel')}>
                  <h5>External Links</h5>
                  <ul className={f('no-bullet')}>
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        className={f('ext')}
                        target="_blank"
                        pattern={currentSet.url_template}
                      >
                        View {metadata.accession.toUpperCase()} in{' '}
                        {currentSet.name}
                      </BaseLink>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
          <div className={f('row')}>
            <div ref={this._ref} style={{ minHeight: 500 }} />
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

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(SummarySet);
