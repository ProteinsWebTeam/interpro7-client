// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Accession from 'components/Accession';
import Description from 'components/Description';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { BaseLink } from 'components/ExtLink';
import { setDBs } from 'utils/processDescription/handlers';
import { getTextForLabel } from 'utils/text';
import Literature from 'components/Entry/Literature';

import ClanViewer from 'clanviewer';
import 'clanviewer/build/main.css';
import ZoomOverlay from 'components/ZoomOverlay';

import loadable from 'higherOrder/loadable';
import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import style from './style.css';
import LabelBy from '../../ProtVista/Options/LabelBy';

const f = foundationPartial(ebiGlobalStyles, style);

/*::
type Props = {
  data: {
    metadata: Object,
  },
  db: string,
  goToCustomLocation: function,
  customLocation: Object,
  loading: boolean,
  label: {
    accession: boolean,
    name: boolean,
    short: boolean,
  },
};

type State = {
  showClanViewer: boolean,
  nodeHovered: null | {
    accession:string,
    name:string,
    short_name:string,
  }
};
 */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const MAX_NUMBER_OF_NODES = 100;
export const schemaProcessData = (
  {
    data: { accession, score },
    db,
  } /*: {data: {accession: string, score: number}, db: string} */,
) => ({
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

const SetLiterature = ({ literature }) => {
  if (!literature) return null;
  const literatureEntries = literature.map((ref) => {
    const journalRegExp = /(.+) (\d{4});(\d+):(\d+-\d+)./;
    const matches = journalRegExp.exec(ref.journal);
    if (matches) {
      return [
        ref.PMID,
        {
          ...ref,
          ISO_journal: matches[1],
          year: matches[2],
          volume: matches[3],
          raw_pages: matches[4],
        },
      ];
    }
    return [ref.PMID, ref];
  });
  return (
    <>
      <h4>Literature</h4>
      <Literature extra={literatureEntries} />
    </>
  );
};
SetLiterature.propTypes = {
  literature: T.array,
};

const SetDescription = ({ accession, description }) => {
  if (!accession || !description) return null;
  return (
    <>
      <h4>Description</h4>
      <Description textBlocks={[description]} accession={accession} />
    </>
  );
};
SetDescription.propTypes = {
  accession: T.string,
  description: T.string,
};
const SetAuthors = ({ authors }) => {
  if (!authors) return null;
  return (
    <tr>
      <td>Authors</td>
      <td data-testid="set-type">{authors.join(', ')}</td>
    </tr>
  );
};
SetAuthors.propTypes = {
  authors: T.arrayOf(T.string),
};

class SummarySet extends PureComponent /*:: <Props, State> */ {
  /*::
    _ref: { current: null | React$ElementRef<'div'> };
    _vis: typeof ClanViewer;
    loaded: boolean;
  */
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    db: T.string.isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
    loading: T.bool.isRequired,
    label: T.shape({
      accession: T.bool,
      name: T.bool,
      short: T.bool,
    }),
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
    this.state = { showClanViewer: false, nodeHovered: null };
    this.loaded = false;
  }

  componentDidMount() {
    if (!this._ref.current || this._vis) return;
    this._vis = new ClanViewer({
      element: this._ref.current,
      useCtrlToZoom: true,
      height: 600,
      nodeLabel: (node) => {
        console.log(node);
        return getTextForLabel(node, this.props.label);
      },
    });
    if (
      this.props.data &&
      this.props.data.metadata &&
      this.props.data.metadata.relationships &&
      this.props.data.metadata.relationships.nodes &&
      this.props.data.metadata.relationships.nodes.length <= MAX_NUMBER_OF_NODES
    )
      this.setState({ showClanViewer: true });
    this._ref.current?.addEventListener('click', (evt /*: Event */) =>
      this._handleClick(evt),
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.label !== this.props.label) this._refreshLabels();
    if (
      prevProps.data?.metadata?.accession !==
      this.props?.data?.metadata?.accession
    )
      this.loaded = false;
    this.repaint();
  }

  componentWillUnmount() {
    if (this._ref.current) {
      this._ref.current?.removeEventListener('click', this._handleClick);
    }
    this._vis.clear();
  }
  repaint() {
    if (
      (this.state.showClanViewer ||
        this.props.data.metadata.relationships.nodes.length <=
          MAX_NUMBER_OF_NODES) &&
      !this.loaded
    ) {
      const data = this.props.data.metadata.relationships;
      this._vis.clear();
      this._vis.paint(data, false);
      this.loaded = true;
      for (const node /*: HTMLElement */ of this._ref.current?.querySelectorAll(
        'g.node',
      ) || []) {
        node.addEventListener('mouseenter', (evt /*: Event */) => {
          this.setState({ nodeHovered: (evt.target /*: any */).__data__ });
        });
        node.addEventListener('mouseleave', () => {
          this.setState({ nodeHovered: null });
        });
      }
    }
  }

  _handleClick = (event /*: Event */) => {
    const g = event
      .composedPath()
      .filter((e /*: any */) => e.nodeName === 'g')
      .filter((e /*: any */) => e.classList.contains('node'))?.[0];
    if (g) {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'entry' },
          entry: {
            db: this.props.db,
            accession: (g /*: any */).dataset.accession,
          },
        },
      });
    }
  };
  _refreshLabels = () => {
    this._vis.updatingLabels = true;
    if (this._vis.tick) this._vis.tick();
    this._vis.updatingLabels = false;
  };
  render() {
    const metadata =
      this.props.loading || !this.props.data.metadata
        ? {
            accession: '',
            description: '',
            id: '',
            source_database: '',
            authors: null,
            literature: null,
          }
        : this.props.data.metadata;
    let currentSet = null;
    if (metadata.source_database) {
      for (const db of setDBs) {
        if (db.name === metadata.source_database) currentSet = db;
      }
      if (metadata.source_database === 'panther')
        metadata.description = metadata.name.name;
    }

    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              <table className={f('light', 'table-sum')}>
                <tbody>
                  <tr>
                    <td>Accession</td>
                    <td data-testid="set-accession">
                      <Accession accession={metadata.accession} />
                    </td>
                  </tr>
                  <tr>
                    <td>Data type</td>
                    <td data-testid="set-type">Set</td>
                  </tr>
                  <tr>
                    <td style={{ width: '200px' }} data-testid="set-memberdb">
                      Member database
                    </td>
                    <td>{currentSet?.dbName || metadata.source_database}</td>
                  </tr>
                  <SetAuthors authors={metadata.authors} />
                </tbody>
              </table>
              <SetDescription
                accession={metadata.accession}
                description={metadata?.description}
              />
              <SetLiterature literature={metadata?.literature} />
              {metadata.relationships &&
                metadata.relationships.nodes &&
                metadata.relationships.nodes.map((m) => (
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
                  <ul
                    className={f('no-bullet')}
                    data-testid="set-external-links"
                  >
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        className={f('ext')}
                        target="_blank"
                        pattern={currentSet.url_template}
                      >
                        View {metadata.accession} in {currentSet.dbName}
                      </BaseLink>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
          <div className={f('row')}>
            {!this.state.showClanViewer &&
              metadata.relationships &&
              metadata.relationships.nodes &&
              metadata.relationships.nodes.length > MAX_NUMBER_OF_NODES && (
                <div
                  className={f('flex-card')}
                  style={{ width: '50%', padding: '1em' }}
                >
                  <h3>ClanViewer</h3>
                  <section>
                    The selected clan has {metadata.relationships.nodes.length}{' '}
                    member entries. Displaying more than {MAX_NUMBER_OF_NODES}{' '}
                    nodes in this visualisation can affect the performance of
                    your browser.
                    <button
                      className={f('button')}
                      onClick={() => this.setState({ showClanViewer: true })}
                    >
                      Visualise it
                    </button>
                  </section>
                </div>
              )}
            <div>
              <DropDownButton
                label="Label Content"
                extraClasses={f('protvista-menu')}
              >
                <LabelBy />
              </DropDownButton>
            </div>
            <div className={f('clanviewer-container')}>
              <ZoomOverlay elementId="clanViewerContainer" />
              <div
                ref={this._ref}
                style={{ minHeight: 500 }}
                id="clanViewerContainer"
              />
              <div
                className={f('legends')}
                style={{
                  opacity: this.state.nodeHovered ? 1 : 0,
                }}
              >
                <ul className={f('no-bullet')}>
                  <li>
                    <b>Accession</b>: {this.state?.nodeHovered?.accession}
                  </li>
                  <li>
                    <b>Name</b>: {this.state?.nodeHovered?.name}
                  </li>
                  <li>
                    <b>Short name</b>: {this.state?.nodeHovered?.short_name}
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

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.set.db,
  (state) => state.settings.ui,
  (db, ui) => ({ db, label: ui.labelContent }),
);

export default connect(mapStateToProps, { goToCustomLocation })(SummarySet);
