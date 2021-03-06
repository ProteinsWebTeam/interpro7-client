import React, { PureComponent } from 'react';
import T from 'prop-types';
import { noop } from 'lodash-es';
import { format2label } from '../FormatSelector';
import { toPlural } from 'utils/pages';
import NumberComComponent from 'components/NumberComponent';
import styles from './style.css';

/* :: type Props = {
  children: any,
}; */

class Highlight extends PureComponent /*:: <Props> */ {
  /*::  _ref: { current: null | React$ElementRef<'span'> } */
  static propTypes = {
    children: T.any.isRequired,
  };

  constructor(props /*: Props */) {
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

const getMainFragment = (description, count) => {
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
        <Highlight>a list</Highlight> of approximately{' '}
        <NumberComComponent abbr>{count}</NumberComComponent>{' '}
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
        <Highlight>a list</Highlight> of approximately{' '}
        <NumberComComponent abbr>{count}</NumberComComponent>{' '}
        <Highlight>{db || integration}</Highlight>{' '}
        <Highlight>{toPlural(main)}</Highlight>
      </>
    );
  }
  return (
    <>
      <Highlight>a list of counts</Highlight> of{' '}
      <Highlight>{toPlural(main)}</Highlight> from each data source in InterPro
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
        any <Highlight>{db || integration}</Highlight>{' '}
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

const getFilters = (description) =>
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

/* :: type textExplanationProps = {
  fileType: string,
  description: {
    main: {
      key: string
      },
     entry: {
      isFilter: ?boolean,
      accession: ?string,
      db: string
     },
     },
  subset: boolean,
  isStale: boolean,
  noData: boolean,
  count: number,
}; */

export default class TextExplanation extends PureComponent /*:: <textExplanationProps> */ {
  static propTypes = {
    fileType: T.string,
    description: T.object.isRequired,
    subset: T.bool.isRequired,
    isStale: T.bool.isRequired,
    count: T.number.isRequired,
    noData: T.bool.isRequired,
  };

  render() {
    const {
      fileType,
      description,
      subset,
      isStale,
      count,
      noData,
    } = this.props;

    const filters = getFilters(description);
    let filterText = '';
    if (filters.length) {
      filterText = <> which match with {filters}</>;
    }

    let explanation;
    if (isStale) {
      explanation = <p>Preparing data...</p>;
    } else {
      if (noData) {
        explanation = <p>No data matches the selected set of filters</p>;
      } else {
        explanation = (
          <p>
            This {format2label[fileType || 'accession']} file will contain{' '}
            {getMainFragment(description, count)} {filterText}.
          </p>
        );
        fileType === 'fasta' &&
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
          );
      }
    }
    return (
      <section>
        <h6>Explanation</h6>
        {explanation}
      </section>
    );
  }
}
