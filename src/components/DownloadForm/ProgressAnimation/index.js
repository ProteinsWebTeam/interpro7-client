/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import T from 'prop-types';

export default class ProgressAnimation extends PureComponent {
  static propTypes = {
    download: T.shape({
      progress: T.number,
      successful: T.bool,
    }).isRequired,
  };

  render() {
    const {
      download: { progress, successful },
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    let visualProgress = 0;
    if (downloading) {
      if (progress) {
        visualProgress = progress * 0.85 + 0.075;
      } else {
        visualProgress = 0.075;
      }
    } else if (progress === 1) {
      visualProgress = 1;
    }

    return (
      <React.Fragment>
        <svg width="0" height="0">
          <defs>
            <filter id="gooey-filter">
              <feGaussianBlur
                in="SourceGraphic"
                result="blurred"
                stdDeviation="10"
              />
              <feColorMatrix
                in="blurred"
                result="matrix"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              />
              <feBlend in="SourceGraphic" in2="matrix" />
            </filter>
          </defs>
        </svg>
        <div
          style={{
            background: 'lightblue',
            height: '5em',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              filter: 'url(#gooey-filter)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '1.75em',
                background: 'white',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '-3em',
                width: 'calc(100% + 3em)',
                transition: 'transform ease-out 1s',
                transform: `translateX(${visualProgress * 100}%)`,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '2em',
                  height: '1em',
                  left: '-0.5em',
                  width: '1em',
                  borderRadius: '50%',
                  background: 'white',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1em',
                  height: '3em',
                  left: '0',
                  width: '3em',
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <span>{Math.floor((progress || 0) * 100)}%</span>
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: 'calc(2.5em - 2px)',
                  height: '4px',
                  left: '-100%',
                  width: '100%',
                  background: 'white',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '1.75em',
                background: 'white',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '2em',
              background: 'white',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '2em',
              background: 'white',
            }}
          />
        </div>
      </React.Fragment>
    );
  }
}
