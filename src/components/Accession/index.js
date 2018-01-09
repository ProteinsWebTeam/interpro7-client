// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { UniProtLink, ProteomeLink } from 'components/ExtLink';

const Default = ({ children }) => <span>{children}</span>;
Default.propTypes = {
  children: T.oneOfType([T.string, T.number]).isRequired,
};

const componentMap = new Map([
  ['reviewed', UniProtLink],
  ['unreviewed', UniProtLink],
  ['proteome', ProteomeLink],
]);

/*:: type Props = {
  accession: string | number,
  id?: string,
  db: string,
}; */

export class Accession extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.oneOfType([T.string, T.number]).isRequired,
    id: T.string,
    title: T.string,
    db: T.string.isRequired,
  };

  render() {
    const { accession, id, db, title } = this.props;
    const Link = componentMap.get(db) || Default;
    return (
      <div>
        {title == null ? 'Accession' : title}:{' '}
        <Link id={accession}>{accession}</Link>
        {id && ` (${id})`}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key === 'organism'
      ? state.customLocation.description.organism.proteomeDB ||
        state.customLocation.description.organism.db
      : state.customLocation.description[
          state.customLocation.description.main.key
        ].db,
  db => ({ db }),
);

export default connect(mapStateToProps)(Accession);
