import React, { PureComponent } from 'react';
import T from 'prop-types';

import { toPlural } from 'utils/pages';

import styles from './style.css';

const Highlight = ({ children }) => (
  <span className={styles.highlight}>{children}</span>
);
Highlight.propTypes = {
  children: T.string.isRequired,
};

const getMainFragment = description => {
  const main = description.main.key;
  const { db, integration, accession } = description[main];
  if (accession) {
    return (
      <React.Fragment>
        <Highlight>metadata</Highlight> about <Highlight>{db}</Highlight>{' '}
        <Highlight>{main}</Highlight> with accession{' '}
        <Highlight>{accession}</Highlight>
      </React.Fragment>
    );
  }
  if (db || integration) {
    return (
      <React.Fragment>
        <Highlight>a list</Highlight> of{' '}
        <Highlight>{db || integration}</Highlight>{' '}
        <Highlight>{toPlural(main)}</Highlight>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Highlight>a counter overview</Highlight> centered on{' '}
      <Highlight>{toPlural(main)}</Highlight>
    </React.Fragment>
  );
};

const getFilterFragment = (type, { db, accession }) => {
  if (accession) {
    return (
      <React.Fragment>
        the <Highlight>{db}</Highlight>{' '}
        <Highlight>{type === 'taxonomy' ? 'taxon' : type}</Highlight> with
        accession <Highlight>{accession}</Highlight>
      </React.Fragment>
    );
  }
  if (db) {
    return (
      <React.Fragment>
        any of the <Highlight>{db}</Highlight>{' '}
        <Highlight>{toPlural(type)}</Highlight>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      any <Highlight>{type === 'taxonomy' ? 'taxon' : type}</Highlight>
    </React.Fragment>
  );
};

const getFilters = description =>
  Object.entries(description)
    .filter(([, desc]) => desc.isFilter)
    .map(([type, desc], i, { length }) => (
      // This logic is to have `join` between the different filters correct in
      // english (proper use of `,`, `and`, and `, and`)
      <React.Fragment key={type}>
        {i > 0 && length > 2 && ', '}
        {i === length - 1 && i > 0 && ' and '}
        {getFilterFragment(type, desc)}
      </React.Fragment>
    ));

export default class TextExplanation extends PureComponent {
  static propTypes = {
    fileType: T.string.isRequired,
    description: T.object.isRequired,
  };

  render() {
    const { fileType, description } = this.props;

    const filters = getFilters(description);
    let filterText = '';
    if (filters.length) {
      filterText = <React.Fragment> which match with {filters}</React.Fragment>;
    }

    return (
      <React.Fragment>
        <h6>Explanation</h6>
        <p>
          This <Highlight>{fileType}</Highlight> file will contain{' '}
          {getMainFragment(description)}
          {filterText}.
        </p>
      </React.Fragment>
    );
  }
}
