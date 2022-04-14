import React, { PureComponent } from 'react';
// Animation
import { Tweenable } from 'shifty';

const applyStyleToSelection = (selection, { opacity, y }) => {
  selection.forEach((element) => {
    if (typeof opacity !== 'undefined') element.style.opacity = opacity;
    if (typeof y !== 'undefined')
      element.style.transform = `translateY(${y}px)`;
  });
};
class InterProGraphicAnim extends PureComponent {
  componentDidMount() {
    this.notHighBlob = document.querySelectorAll('.blob:not(.high-blob)');
    this.lineUp = document.querySelectorAll('.blob.line-up');
    this.lineDown = document.querySelectorAll('.blob.line-down');
    this.highBlob = document.querySelectorAll('.high-blob');
  }

  t1 = new Tweenable({ opacity: 1, y: 0 });

  _step = ({ opacity, y }) => {
    applyStyleToSelection(this.notHighBlob, { opacity });
    applyStyleToSelection(this.lineUp, { y });
    applyStyleToSelection(this.lineDown, { y: -y });
    applyStyleToSelection(this.highBlob, { opacity: 1 });
  };

  _handleMouseOver = () => {
    if (!this.notHighBlob) return;
    this.t1.stop();
    this.t1.tween({
      to: { opacity: 0.2, y: 160 },
      step: this._step,
    });
  };

  _handleMouseOut = () => {
    if (!this.notHighBlob) return;
    this.t1.stop();
    this.t1.tween({
      to: { opacity: 1, y: 0 },
      step: this._step,
    });
  };

  render() {
    return (
      <svg
        viewBox="38 4 150 120"
        width="100%"
        className="container-anim"
        onMouseOver={this._handleMouseOver}
        onFocus={this._handleMouseOver}
        onMouseOut={this._handleMouseOut}
        onBlur={this._handleMouseOut}
      >
        <g transform="rotate(45, 100, 100)">
          <g>
            <line
              x1="20"
              y1="-200"
              x2="20"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              className="line"
            />
            <line
              x1="20"
              y1="72"
              x2="20"
              y2="200"
              strokeLinecap="round"
              stroke="#147eaf"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="20"
              y1="-70"
              x2="20"
              y2="-200"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-up high-blob"
            />
          </g>
          <g>
            <line
              x1="50"
              y1="-200"
              x2="50"
              y2="200"
              strokeWidth="24"
              stroke="#cacaca"
              className="line"
            />
            <line
              x1="50"
              y1="260"
              x2="50"
              y2="300"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className="blob line-down"
            />
            <line
              x1="50"
              y1="224"
              x2="50"
              y2="240"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-down high-blob"
            />
            <line
              x1="50"
              y1="-120"
              x2="50"
              y2="200"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className="blob line-down"
            />
          </g>
          <g>
            <line
              x1="80"
              y1="-200"
              x2="80"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              className="line"
            />
            <line
              x1="80"
              y1="100"
              x2="80"
              y2="200"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="80"
              y1="66"
              x2="80"
              y2="80"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="80"
              y1="-50"
              x2="80"
              y2="44"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="80"
              y1="-80"
              x2="80"
              y2="-120"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-up high-blob"
            />
            <line
              x1="80"
              y1="-140"
              x2="80"
              y2="-140"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="80"
              y1="-160"
              x2="80"
              y2="-160"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="80"
              y1="-180"
              x2="80"
              y2="-200"
              strokeLinecap="round"
              stroke="grey"
              strokeWidth="16"
              className="blob line-up"
            />
          </g>
          <g>
            <line
              x1="110"
              y1="-200"
              x2="110"
              y2="200"
              strokeWidth="24"
              stroke="#cacaca"
              className="line"
            />
            <line
              x1="110"
              y1="270"
              x2="110"
              y2="270"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className="blob line-down"
            />
            <line
              x1="110"
              y1="220"
              x2="110"
              y2="230"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-down high-blob"
            />
            <line
              x1="110"
              y1="-100"
              x2="110"
              y2="200"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className="blob line-down"
            />
            <line
              x1="110"
              y1="-120"
              x2="110"
              y2="-180"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className="blob line-down"
            />
          </g>
          <g>
            <line
              x1="140"
              y1="-200"
              x2="140"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              id="line-l05"
              className="line"
            />
            <line
              x1="140"
              y1="-60"
              x2="140"
              y2="60"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className="blob line-up"
            />
            <line
              x1="140"
              y1="-86"
              x2="140"
              y2="-110"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className="blob line-up high-blob"
            />
            <line
              x1="140"
              y1="-130"
              x2="140"
              y2="-200"
              strokeLinecap="round"
              stroke="#147eaf"
              strokeWidth="16"
              className="blob line-up"
            />
          </g>
        </g>
      </svg>
    );
  }
}
export default InterProGraphicAnim;
