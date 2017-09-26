/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2, 3, 10]}]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';
import Link from 'components/generic/Link';

import ColorHash from 'color-hash/lib/color-hash';

import { foundationPartial } from 'styles/foundation';

import pageStyle from './style.css';
const f = foundationPartial(pageStyle);

const colorHash = new ColorHash();

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

class IDAGraphic extends PureComponent {
  static propTypes = {
    idaObj: T.object.isRequired,
  };

  render() {
    const { idaObj } = this.props;
    const options = {
      trackHeight: 20,
    };
    const height =
      idaObj.domains.length * options.trackHeight + options.trackHeight / 2;
    const legendHeight = options.trackHeight / 3;
    let gapBetwenGuidelines = Math.pow(10, `${idaObj.length}`.length - 1);
    let numberOfGuides = Math.trunc(idaObj.length / gapBetwenGuidelines);
    if (numberOfGuides < 2) {
      gapBetwenGuidelines /= 10;
      numberOfGuides = Math.trunc(idaObj.length / gapBetwenGuidelines);
    }
    return (
      <div className={f('svgContainer')} style={{ height }}>
        <svg
          className={f('svg')}
          preserveAspectRatio="none meet"
          viewBox={`0 0 ${idaObj.length} ${height}`}
        >
          <g className={f('guidelines')}>
            {Array(...{ length: numberOfGuides }).map((x, i) => (
              <g key={i}>
                <line
                  x1={(i + 1) * gapBetwenGuidelines}
                  x2={(i + 1) * gapBetwenGuidelines}
                  y1="0"
                  y2={height}
                  strokeDasharray="4, 2"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={2 + (i + 1) * gapBetwenGuidelines}
                  y={legendHeight}
                  style={{ fontSize: legendHeight }}
                  fill="black"
                >
                  {(i + 1) * gapBetwenGuidelines}
                </text>
              </g>
            ))}
          </g>
          <g>
            {idaObj.domains.map((domain, t) => (
              <g
                key={domain.accessions.join()}
                className={f('domain')}
                transform={`translate(0 ${t * options.trackHeight})`}
              >
                {domain.locations.map((location, i) => (
                  <g key={i} className={f('location')}>
                    {location.fragments.map((fragment, j) => (
                      <rect
                        key={j}
                        y={options.trackHeight / 2}
                        x={fragment.start}
                        width={fragment.end - fragment.start}
                        fill={colorHash.hex(domain.accessions[0])}
                        height={10}
                      />
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

class DomainArchitectures extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    description: T.object.isRequired,
  };

  render() {
    const {
      data: { loading, payload },
      description: { mainAccession },
    } = this.props;
    if (loading)
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading… </div>
        </div>
      );
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          {(payload.results || []).map(obj => {
            const idaObj = ida2json(obj.IDA);
            return (
              <div key={obj.IDA_FK} className={f('margin-top-large')}>
                <Link
                  newTo={{
                    description: {
                      mainType: 'protein',
                      mainDB: 'uniprot',
                      focusType: 'entry',
                      focusDB: 'interpro',
                      focusAccession: mainAccession,
                    },
                    search: { ida: obj.IDA_FK },
                  }}
                >
                  There are {obj.unique_proteins} proteins{' '}
                </Link>
                with this architecture:<br />
                {idaObj.domains.map(d => (
                  <span key={d.accessions.join('|')}>
                    {d.accessions.map(acc => (
                      <Link
                        key={acc}
                        newTo={{
                          description: {
                            mainType: 'entry',
                            mainDB: 'interpro',
                            mainAccession: acc,
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
                <IDAGraphic idaObj={idaObj} />
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
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.ida = null;
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description,
    ).replace('domain_architecture', '')}?${qsStringify(_search)}`;
  },
);

const mapStateToProps = createSelector(
  state => state.newLocation.description,
  description => ({ description }),
);

export default connect(mapStateToProps)(
  loadData({
    getUrl: getUrlFor,
  })(DomainArchitectures),
);
