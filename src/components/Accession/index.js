import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const Default = ({ children }) => <span>{children}</span>;
Default.propTypes = {
  children: T.oneOfType([T.string, T.number]).isRequired,
};

/*:: type Props = {
  accession: string | number,
  db: string,
}; */

export class Accession extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.oneOfType([T.string, T.number]).isRequired,
    title: T.string,
    db: T.string,
  };

  render() {
    const { accession, title } = this.props;
    return (
      <div>
        {title !== '' ? <span> {title || 'Accession'}:</span> : null}

        {title === 'Job ID' ? (
          <span className={f('tag-sqc')}> {accession}</span>
        ) : (
          accession
        )}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  db => ({ db }),
);

export default connect(mapStateToProps)(Accession);
