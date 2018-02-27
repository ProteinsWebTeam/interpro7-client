/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2, 3, 10]}]*/
import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import ProtVistaMatches from 'components/Matches/ProtVistaMatches';
import protvista from 'components/ProtVista/style.css';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import pageStyle from './style.css';

const f = foundationPartial(pageStyle, protvista);
import { getTrackColor, EntryColorMode } from 'utils/entryColor';

const groupDomains = domains => {
  const groups = {};
  for (const domain of domains) {
    if (!(domain.id in groups)) {
      groups[domain.id] = {
        accessions: domain.accessions,
        locations: [{ fragments: [] }],
      };
    }
    groups[domain.id].locations[0].fragments.push({
      start: domain.fragment[0],
      end: domain.fragment[1],
    });
  }
  return Object.values(groups);
};

const ida2json = ida => {
  const idaParts = ida.split('#');
  const numDigitsInAccession = 6;
  const obj = {
    length: Number(idaParts[0].split('/')[0]),
    domains: groupDomains(
      idaParts[1].split('~').map(match => {
        const m = match.split(':');
        return {
          id: m[0],
          accessions: m[0]
            .split('&')
            .map(acc => `IPR${`0000000${acc}`.substr(-numDigitsInAccession)}`),
          fragment: m[1].split('-').map(Number),
        };
      }),
    ),
  };
  return obj;
};

class IDAProtVista extends ProtVistaMatches {
  static propTypes = {
    matches: T.object.isRequired,
  };
  updateTracksWithData(props) {
    const { length, matches } = props;
    if (!this.web_protein.data) this.web_protein.data = ' '.repeat(length);

    for (let domain of matches) {
      const tmp = [
        {
          accession: domain.accessions.join('-'),
          name: domain.accessions.join('-'),
          source_database: 'interpro',
          locations: domain.locations,
          color: getTrackColor(
            { accession: domain.accessions[0] },
            EntryColorMode.ACCESSION,
          ),
          type: 'entry',
        },
      ];

      this.web_tracks[domain.accessions[0]].data = tmp;
    }
  }
  render() {
    const { matches, length } = this.props;
    return (
      <div className={f('track-in-table')}>
        <protvista-manager
          attributes="length displaystart displayend highlightstart highlightend"
          id="pv-manager"
        >
          <div className={f('track-container')}>
            <div className={f('aligned-to-track-component')}>
              <protvista-sequence
                ref={e => (this.web_protein = e)}
                length={length}
                displaystart="1"
                displayend={length}
              />
            </div>
          </div>
          {matches.map(d => (
            <div key={d.accessions[0]} className={f('track-row')}>
              <div className={f('track-component')}>
                <protvista-interpro-track
                  length={length}
                  displaystart="1"
                  displayend={length}
                  id={`track_${d.accessions[0]}`}
                  ref={e => (this.web_tracks[d.accessions[0]] = e)}
                  shape="roundRectangle"
                  expanded
                />
              </div>
              <div className={f('track-accession')}>
                {d.accessions.map(acc => (
                  <Fragment>
                    <Link
                      key={acc}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro', accession: acc },
                        },
                      }}
                    >
                      {acc}
                    </Link>{' '}
                    -
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </protvista-manager>
      </div>
    );
  }
}

class DomainArchitectures extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    mainAccession: T.string,
  };

  render() {
    const { data: { loading, payload }, mainAccession } = this.props;
    if (loading) return <Loading />;
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          {(payload.results || []).map(obj => {
            const idaObj = ida2json(obj.IDA);
            return (
              <div key={obj.IDA_FK} className={f('margin-bottom-large')}>
                <Link
                  to={{
                    description: {
                      main: { key: 'protein' },
                      protein: { db: 'UniProt' },
                      entry: { db: 'InterPro', accession: mainAccession },
                    },
                    search: { ida: obj.IDA_FK },
                  }}
                >
                  There {obj.unique_proteins > 1 ? 'are' : 'is'}{' '}
                  {obj.unique_proteins} proteins{' '}
                </Link>
                with this architecture:<br />
                {idaObj.domains.map(d => (
                  <span key={d.accessions.join('|')}>
                    {d.accessions.map(acc => (
                      <Link
                        key={acc}
                        to={{
                          description: {
                            main: { key: 'entry' },
                            entry: { db: 'InterPro', accession: acc },
                          },
                        }}
                      >
                        {' '}
                        {acc}{' '}
                      </Link>
                    ))}{' '}
                    -
                  </span>
                ))}
                <IDAProtVista matches={idaObj.domains} length={idaObj.length} />
                {/* <pre>{JSON.stringify(idaObj, null, ' ')}</pre>*/}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.ida = null;
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath(description).replace('domain_architecture', ''),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  mainAccession => ({ mainAccession }),
);

export default connect(mapStateToProps)(
  loadData({
    getUrl: getUrlFor,
  })(DomainArchitectures),
);
