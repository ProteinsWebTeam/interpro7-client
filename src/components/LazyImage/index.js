import React, { PureComponent } from 'react';
import T from 'prop-types';

import cancelable from 'utils/cancelable';
import getsInView from 'utils/getsInView';
import { schedule } from 'timing-functions/src';

const TRANSPARENT_1PX_PNG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class LazyImage extends PureComponent {
  static propTypes = {
    visible: T.bool,
    rootMargin: T.string,
    src: T.string,
    srcSet: T.string,
  };

  constructor(props) {
    super(props);
    this.state = { wasRendered: !!props.visible };
  }

  async componentDidMount() {
    if (this.state.wasRendered) return;
    try {
      this._inView = cancelable(
        schedule().then(() =>
          getsInView(this._node, this.props.rootMargin || '10px'),
        ),
      );
      await this._inView.promise;
      this.setState({ wasRendered: true });
    } catch (_) {
      /**/
    }
  }

  componentWillUnmount() {
    if (this._inView) this._inView.cancel();
  }

  render() {
    const { src, srcSet, ...props } = this.props;
    const sources = { src: TRANSPARENT_1PX_PNG };
    if (this.state.wasRendered) {
      sources.src = src;
      sources.srcSet = srcSet;
    }
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...sources} {...props} ref={node => (this._node = node)} />;
  }
}

export default LazyImage;
