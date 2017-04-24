import React, {Component} from 'react'; import T from 'prop-types';
import {findDOMNode} from 'react-dom';
import TransitionGroup from 'react-addons-transition-group';

const DELAY = 100;
const DURATION = 500;

const animate = ({
  delay = DELAY,
  duration = DURATION,
  selector,
} = {}) => Composed => {
  class Wrapper extends Component {
    static displayName = `AnimateWrapper(${
      Composed.displayName || Composed.name
    })`;
    static propTypes = {
      location: T.object.isRequired,
      data: T.object,
    };

    state = {stalled: null};

    async componentWillReceiveProps(nextProps) {
      if (nextProps.location.pathname === this.props.location.pathname) return;
      this.setState({stalled: nextProps});
      console.log('about to disappear');
      await this.disappear();
      console.log('disappeared');
      this.setState({stalled: null});
    }

    componentDidUpdate(prevProps) {
      console.log('componentdidupdate');
      if (!this.state.stalled && prevProps.data !== this.props.data) {
        console.log('about to appear');
        this.appear().then(() => console.log('appeared'));
      }
    }

    componentDidAppear() {
      console.log('about to appear');
      this.appear().then(() => console.log('appeared'));
    }

    getSelected() {
      return [...findDOMNode(this).querySelectorAll(selector)];
    }

    appear() {
      return Promise.all(this.getSelected().map(
        (card, i) => new Promise(res => {
          if (!card.animate) res();
          const animation = card.animate(
            [
              // {
              //   transform: `scale(5) rotate(${
              //     i % 2 ? '-' : ''
              //   }10deg) translateX(${i % 2 ? '-' : ''}100vw)`,
              //   opacity: 0
              // },
              // {transform: 'scale(1) rotate(0) translateX(0)', opacity: 1},
              {opacity: 0},
              {opacity: 1},
            ],
            {
              duration,
              easing: 'ease-in-out',
              delay: i * delay,
              fill: 'backwards',
            }
          );
          animation.onfinish = res;
        })
      ));
    }

    disappear() {
      return Promise.all(this.getSelected().reverse().map(
        (card, i) => new Promise(res => {
          if (!card.animate) res();
          const animation = card.animate(
            [
              {opacity: 1/* , transform: 'translateX(0)' */},
              {opacity: 0/* , transform: 'translateX(100vw)' */},
            ],
            {
              duration,
              easing: 'ease-in-out',
              delay: i * delay,
              fill: 'forwards',
            }
          );
          animation.onfinish = res;
        })
      ));
    }

    render() {
      const props = this.state.stalled || this.props;
      return (
        <div>
          <Composed {...props} />
        </div>
      );
    }
  }

  return (props) => (
    <TransitionGroup>
      <Wrapper {...props} />
    </TransitionGroup>
  );
};

export default animate;
