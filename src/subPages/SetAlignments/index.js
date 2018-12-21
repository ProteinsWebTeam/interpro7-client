import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';

import Loading from 'components/SimpleCommonComponents/Loading';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { Column } from 'components/Table';
import Table from 'components/Table';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import { foundationPartial } from 'styles/foundation';
import protvista from 'components/ProtVista/style.css';

// import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import ProtVistaMatches from 'components/Matches/ProtVistaMatches';

const f = foundationPartial(protvista);

class AlignmentProtvista extends ProtVistaMatches {
  async updateTracksWithData({ matches, length }) {
    this._webProteinRef.data = '\u00A0'.repeat(length);
    for (const [entry, { domains }] of matches) {
      this.web_tracks[entry].data = [
        {
          locations: domains.map(d => ({ fragments: [d] })),
          accession: entry,
          type: 'entry',
          color: getTrackColor({ accession: entry }, EntryColorMode.ACCESSION),
        },
      ];
    }
  }
  render() {
    const { accession, matches, length } = this.props;
    return (
      <div className={f('track-in-table')}>
        <div className={f('track-container')}>
          <div className={f('aligned-to-track-component')}>
            <protvista-sequence
              ref={e => (this._webProteinRef = e)}
              length={length}
              displaystart="1"
              displayend={length}
            />
          </div>
        </div>
        {matches.map(([entry, { score, domains }]) => (
          <div key={entry} className={f('track-component')}>
            <Tooltip
              title={`<b>${entry}</b><p>Score: ${score}</p>Location: ${domains
                .map(d => `[${d.start}-${d.end}]`)
                .join(', ')}`}
            >
              <protvista-interpro-track
                length={length}
                displaystart="1"
                displayend={length}
                id={`track_${accession}_${entry}`}
                ref={e => (this.web_tracks[entry] = e)}
                shape="roundRectangle"
                expanded
              />
            </Tooltip>
          </div>
        ))}
      </div>
    );
  }
}

/*:: type Props = {
  data: Object,
}; */

class SetAlignmentsSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
    // mainType: T.string.isRequired,
  };
  state = {};

  handleClick = ({ target: { value: acc } }) => {
    this.setState({ [acc]: !this.state[acc] });
  };
  render() {
    const { data, search } = this.props;
    if (data.loading) return <Loading />;
    return (
      <div className={f('row', 'column')}>
        <Table
          actualSize={data.payload.count}
          dataTable={data.payload.results}
          query={search}
        >
          <Column
            dataKey="accession"
            headerStyle={{
              width: '10%',
            }}
            cellStyle={{
              whiteSpace: 'nowrap',
              verticalAlign: 'top',
            }}
            renderer={accession => (
              <button onClick={this.handleClick} value={accession}>
                {this.state[accession] ? '▾ ' : '▸ '} {accession}
              </button>
            )}
          />
          <Column
            dataKey="alignedTo"
            renderer={(alignedTo, { accession }) => {
              const length = Math.max(
                ...Object.values(alignedTo).map(e => e.length),
              );
              return this.state[accession] ? (
                <AlignmentProtvista
                  accession={accession}
                  matches={Object.entries(alignedTo).sort(
                    ([_, a], [__, b]) => a.score - b.score,
                  )}
                  length={length}
                />
              ) : (
                <span>{Object.keys(alignedTo).join(', ')}</span>
              );
            }}
          >
            Aligned To
          </Column>
        </Table>
      </div>
    );
  }
}
const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    const s = {
      ...search,
      alignments: '',
    };
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          ...description,
          set: {
            ...description.set,
            detail: null,
          },
        }),
      query: s,
    });
  },
);
const mapStateToProps = createSelector(
  state => state.customLocation.search,
  search => ({ search }),
);
export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  SetAlignmentsSubPage,
);
