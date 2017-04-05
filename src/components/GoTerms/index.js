/* eslint no-magic-numbers: [1, {ignore: [1, 10, 15, 30, 100]}] */
import React, {PropTypes as T} from 'react';

import {GoLink} from 'components/ExtLink';

import loadData from 'higherOrder/loadData';

import ebiStyles from 'styles/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import {foundationPartial} from 'styles/foundation';
const f = foundationPartial(ebiStyles, ipro);

const defaultPayload = {
  biological_process: [],
  molecular_function: [],
  cellular_component: [],
};
export const GoTermsByCategory = (
  {data: {loading, payload = defaultPayload}},
) => (
  <div className={f('row')}>
    {Object.entries(payload)
      .map(([key, values]) => (
        <div key={key} className={f('medium-6', 'large-4', 'columns')}>
          <h5 style={{textTransform: 'capitalize'}}>
            {key.replace('_', ' ')}
          </h5>
          <ul className={f('no-bullet')}>
            { values && values.length ?
              values.map(({id, name}) => (
                <li key={id}>
                  <GoLink
                    id={id}
                    className={f('label', 'go', key)}
                    title={id}
                  >{name || id}</GoLink>
                </li>
              )) :
              <li>
                <span className={f('secondary', 'label')}>
                  {loading ? 'Loading...' : 'None'}
                </span>
              </li>
            }
          </ul>
        </div>
      ))
    }
  </div>
);
GoTermsByCategory.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.shape({
      cellular_component: T.array.isRequired,
      biological_process: T.array.isRequired,
      molecular_function: T.array.isRequired,
    }),
  }).isRequired,
};

const urlFromState = ids => (
  {settings: {ebi: {protocol, hostname, port, root}}},
) => (
  `${protocol}//${hostname}:${port}${root}/../go/entry/${
    ids.join(',')
  }?fields=name,namespace&format=json`
);
const EBISearchDataSelector = payload => payload.entries.reduce(
  (terms, go) => {
    terms[go.fields.namespace].push({
      id: go.id,
      name: go.fields.name,
    });
    return terms;
  },
  {...defaultPayload},
);

const GoTermsByCategoryWithData = ({ids}) => {
  if (!(ids && ids.length)) {
    return (
      <GoTermsByCategory data={{loading: false, payload: defaultPayload}} />
    );
  }
  const loadDataParams = {
    getUrl: urlFromState(ids),
    selector: EBISearchDataSelector,
  };
  const Component = loadData(loadDataParams)(GoTermsByCategory);
  return <Component />;
};
GoTermsByCategoryWithData.propTypes = {
  ids: T.array,
};

const GoTerms = ({terms}/*: {terms: Array<string>} */) => (
  <section id="go-terms">
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <h4>Go terms</h4>
      </div>
    </div>
    {/*<GoTermsByCategoryWithData ids={terms || []} />*/}
  </section>
);
GoTerms.propTypes = {
  terms: T.object.isRequired,
};

export default GoTerms;
