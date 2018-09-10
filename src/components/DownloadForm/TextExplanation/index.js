import React, { PureComponent } from 'react';
import T from 'prop-types';
import { noop } from 'lodash-es';

import { toPlural } from 'utils/pages';

import styles from './style.css';

class Highlight extends PureComponent {
  static propTypes = {
    children: T.any.isRequired,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._animate();
  }

  componentDidUpdate({ children }) {
    if (children !== this.props.children) this._animate();
  }

  _animate = () => {
    if (!this._ref.current || !this._ref.current.animate) return;
    this._ref.current.animate(
      { color: ['red', 'black'] },
      {
        duration: 1000,
        easing: 'ease-in',
        fill: 'both',
      },
    );
  };

  render() {
    return (
      <span className={styles.highlight} ref={this._ref}>
        {this.props.children}
      </span>
    );
  }
}

const getMainFragment = description => {
  const main = description.main.key;
  const { db, integration, accession } = description[main];
  if (accession) {
    return (
      <>
        <Highlight>metadata</Highlight> about <Highlight>{db}</Highlight>{' '}
        <Highlight>{main}</Highlight> with accession{' '}
        <Highlight>{accession}</Highlight>
      </>
    );
  }
  if (db && integration) {
    return (
      <>
        <Highlight>a list</Highlight> of{' '}
        {integration !== 'all' && (
          <>
            <Highlight>{integration}</Highlight>{' '}
          </>
        )}
        <Highlight>{db}</Highlight> <Highlight>{toPlural(main)}</Highlight>
      </>
    );
  }
  if (db || integration) {
    return (
      <>
        <Highlight>a list</Highlight> of{' '}
        <Highlight>{db || integration}</Highlight>{' '}
        <Highlight>{toPlural(main)}</Highlight>
      </>
    );
  }
  return (
    <>
      <Highlight>a counter overview</Highlight> centered on{' '}
      <Highlight>{toPlural(main)}</Highlight>
    </>
  );
};

const getFilterFragment = (type, { db, integration, accession }) => {
  if (accession) {
    return (
      <>
        the <Highlight>{db}</Highlight>{' '}
        <Highlight>{type === 'taxonomy' ? 'taxon' : type}</Highlight> with
        accession <Highlight>{accession}</Highlight>
      </>
    );
  }
  if (db && integration) {
    return (
      <>
        any of the{' '}
        {integration !== 'all' && (
          <>
            <Highlight>{integration}</Highlight>{' '}
          </>
        )}
        <Highlight>{db}</Highlight> <Highlight>{toPlural(type)}</Highlight>
      </>
    );
  }
  if (db || (integration && integration !== 'all')) {
    return (
      <>
        any of the <Highlight>{db || integration}</Highlight>{' '}
        <Highlight>{toPlural(type)}</Highlight>
      </>
    );
  }
  return (
    <>
      any <Highlight>{type === 'taxonomy' ? 'taxon' : type}</Highlight>
    </>
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
    subset: T.bool.isRequired,
  };

  render() {
    const { fileType, description, subset } = this.props;

    const filters = getFilters(description);
    let filterText = '';
    if (filters.length) {
      filterText = <> which match with {filters}</>;
    }

    const main = description.main.key;

    return (
      <section>
        <h6>Explanation</h6>
        <p>
          This{' '}
          <select
            name="fileType"
            value={fileType || 'accession'}
            className={styles.select}
            aria-label="Download type"
            onChange={noop}
            onBlur={noop}
          >
            <option
              value="accession"
              disabled={!description[main].db || description[main].accession}
            >
              Accession
            </option>
            <option value="fasta" disabled={main !== 'protein'}>
              FASTA
            </option>
            <option value="json">JSON</option>
            <option value="ndjson">Newline-delimited JSON</option>
            {/* <option value="tsv">TSV</option> */}
            {/* <option value="xml">XML</option> */}
          </select>{' '}
          file will contain {getMainFragment(description)}
          {filterText}.
        </p>
        {fileType === 'fasta' &&
          description.entry.isFilter &&
          description.entry.accession && (
            <label>
              <input
                name="subset"
                type="checkbox"
                checked={subset}
                onChange={noop}
                onBlur={noop}
              />
              I&apos;m only interested in the part(s) of the sequence matching
              (1 subsequence with all the fragments for every match)
            </label>
          )}
      </section>
    );
  }
}
