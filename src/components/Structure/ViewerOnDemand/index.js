// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';

import loadable from 'higherOrder/loadable';

import isResourceRestricted from './utils/resource-restriction';

import { changeSettingsRaw } from 'actions/creators';

import styles from './style.css';

const StructureViewAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-viewer" */ 'components/Structure/Viewer'),
});

/*:: type Props = {
  id: string,
  matches: Array<Object>,
  userActivatedVisible: boolean,
  changeSettingsRaw: function,
}; */

/*:: type State = {| visible: boolean |}; */

export class ViewerOnDemand extends PureComponent /*:: <Props, State> */ {
  /*:: _ref: { current: null | React$ElementRef<'input'> }; */

  static propTypes = {
    id: T.string.isRequired,
    matches: T.array.isRequired,
    userActivatedVisible: T.bool.isRequired,
    changeSettingsRaw: T.func.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = { visible: props.userActivatedVisible };

    this._ref = React.createRef();
  }

  async componentDidMount() {
    this.setState({ visible: !(await isResourceRestricted()) });
  }

  _handleCheckboxClick = e => e.stopPropagation();

  _handleClick = () => {
    if (this._ref.current && this._ref.current.checked) {
      this.props.changeSettingsRaw('ui', 'structureViewer', true);
    }
    this.setState({ visible: true });
  };

  render() {
    const { id, matches } = this.props;
    if (this.state.visible) {
      return <StructureViewAsync id={id} matches={matches} />;
    }
    return (
      <div className={styles.wrapper}>
        <button className={styles['inner-wrapper']} onClick={this._handleClick}>
          <div className={styles.background}>
            <LazyImage
              src={`//www.ebi.ac.uk/thornton-srv/databases/pdbsum/${id}/traces.jpg`}
              alt={`structure with accession ${id.toUpperCase()}`}
            />
          </div>
          <div className={styles.text}>
            <p>
              click or tap this area to display the interactive structure viewer
            </p>
            <p>
              <label onClick={this._handleCheckboxClick}>
                Remember this next time?{' '}
                <input type="checkbox" ref={this._ref} />
              </label>
              <small>
                This can be reversed in the{' '}
                <Link to={{ description: { other: ['settings'] } }}>
                  Settings
                </Link>{' '}
                page
              </small>
            </p>
          </div>
        </button>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui.structureViewer,
  userActivatedVisible => ({ userActivatedVisible }),
);

export default connect(
  mapStateToProps,
  { changeSettingsRaw },
)(ViewerOnDemand);
