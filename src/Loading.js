import React, {PropTypes as T, Component, cloneElement} from 'react';
import {connect} from 'react-redux';

const INVISIBLE = 0;
const HALF_VISIBLE = 0.5;
const VISIBLE = 1;

class Loading extends Component {
  static propTypes = {
    data: T.shape({
      keyUrl: T.string,
      loading: T.bool.isRequired,
      data: T.object,
      error: T.any,
    }),
    children: T.element,
  };

  state = {}

  componentWillMount() {
    const {data, children} = this.props;
    if (this.shouldSetState({data, children})) this.setState({data, children});
  }

  componentWillReceiveProps({data, children}) {
    if (this.shouldSetState({data, children})) this.setState({data, children});
  }

  shouldSetState({data, children}) {
    return (
      data && children && !data.loading &&
      (!children.dataUrlMatch || children.dataUrlMatch.test(data.urlKey))
    );
  }

  render() {
    const {data: {loading}, children: _, ...otherProps} = this.props;
    const {data, children} = this.state;

    return (
      <div>
        <div style={{
          pointerEvents: loading ? 'auto' : 'none',
          cursor: 'progress',
          opacity: loading ? VISIBLE : INVISIBLE,
          position: 'absolute',
          zIndex: 2,
          width: '100vw',
          height: '100vh',
          textAlign: 'center',
          paddingTop: '2em',
          transition: loading ? 'opacity 0.5s ease-in' : '',
        }}>
          Loading
        </div>
        <div style={{
          opacity: loading ? HALF_VISIBLE : VISIBLE,
          transition: loading ? '' : 'opacity 0.5s ease-out',
        }}>
          {data && children ?
            cloneElement(children, {...otherProps, ...data}) :
            <div>Loading...</div>
          }
        </div>
      </div>
    );
  }
}

export default connect(({data}) => ({data}))(Loading);
