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
import Footer from 'components/Table/Footer';

import { foundationPartial } from 'styles/foundation';
import pageStyle from './style.css';

const f = foundationPartial(pageStyle, protvista);
import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import loadable from 'higherOrder/loadable';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@id': '@isContainedIn',
  '@type': [
    'DomainArchitecture',
    'StructuredValue',
    'BioChemEntity',
    'CreativeWork',
  ],
  identifier: data.ida_id,
  name: data.ida,
});

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
  const idaParts = ida.split('-');
  const n = idaParts.length;
  const length = 1000;
  const gap = 5;
  const feature = (length - gap * (n + 1)) / n;
  const domains = idaParts.map((p, i) => ({
    accession: p.indexOf(':') < 0 ? p : p.split(':')[1],
    locations: [
      {
        fragments: [
          {
            start: gap + i * (gap + feature),
            end: (i + 1) * (gap + feature),
          },
        ],
      },
    ],
  }));
  const grouped = domains.reduce((obj, domain) => {
    if (!obj[domain.accession]) obj[domain.accession] = domain;
    else obj[domain.accession].locations.push(domain.locations[0]);
    return obj;
  }, {});
  const obj = {
    length,
    domains: Object.values(grouped),
    accessions: Object.keys(grouped),
  };
  return obj;
};

class IDAProtVista extends ProtVistaMatches {
  static propTypes = {
    matches: T.arrayOf(T.object).isRequired,
  };
  updateTracksWithData(props) {
    const { matches } = props;

    for (const domain of matches) {
      const tmp = [
        {
          name: domain.accession,
          source_database: 'interpro',
          color: getTrackColor(
            { accession: domain.accession },
            EntryColorMode.ACCESSION,
          ),
          type: 'entry',
          ...domain,
        },
      ];

      this.web_tracks[domain.accession].data = tmp;
    }
  }
  render() {
    const { matches, length } = this.props;
    return (
      <div>
        {matches.map(d => (
          <div key={d.accession} className={f('track-row')}>
            <div className={f('track-component')}>
              <protvista-interpro-track
                length={length}
                displaystart="1"
                displayend={length}
                id={`track_${d.accession}`}
                ref={e => (this.web_tracks[d.accession] = e)}
                shape="roundRectangle"
                expanded
              />
            </div>
            <div className={f('track-accession')}>
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro', accession: d.accession },
                  },
                }}
              >
                {d.accession}
              </Link>
            </div>
          </div>
        ))}
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
    const {
      data: { loading, payload },
      mainAccession,
      search,
    } = this.props;
    if (loading) return <Loading />;
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          {(payload.results || []).map(obj => {
            const idaObj = ida2json(obj.ida);
            return (
              <div key={obj.ida_id} className={f('margin-bottom-large')}>
                <SchemaOrgData data={obj} processData={schemaProcessData} />
                <Link
                  to={{
                    description: {
                      main: { key: 'protein' },
                      protein: { db: 'UniProt' },
                      entry: { db: 'InterPro', accession: mainAccession },
                    },
                    search: { ida: obj.ida_id },
                  }}
                >
                  There {obj.unique_proteins > 1 ? 'are' : 'is'}{' '}
                  {obj.unique_proteins} proteins{' '}
                </Link>
                with this architecture:<br />
                {idaObj.accessions.map(d => (
                  <span key={d}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro', accession: d },
                        },
                      }}
                    >
                      {' '}
                      {d}{' '}
                    </Link>{' '}
                    -{' '}
                  </span>
                ))}
                <IDAProtVista matches={idaObj.domains} length={1000} />
                {/* <pre>{JSON.stringify(idaObj, null, ' ')}</pre>*/}
              </div>
            );
          })}
          <Footer
            withPageSizeSelector={true}
            actualSize={payload.count}
            pagination={search}
          />
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
    console.log(_search, _);
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
  state => state.customLocation.search,
  (mainAccession, search) => ({ mainAccession, search }),
);

export default connect(mapStateToProps)(
  loadData({
    getUrl: getUrlFor,
  })(DomainArchitectures),
);
