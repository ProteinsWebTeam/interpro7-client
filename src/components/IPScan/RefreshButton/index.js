import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

class RefreshButton extends PureComponent {
  static propTypes = {
    updateJobStatus: T.func.isRequired,
  };

  _handleClick = () => {
    if (!this._icon) return;
    if (this._icon.animate) {
      this._icon.animate(
        { transform: ['rotate(0)', 'rotate(360deg)'] },
        { duration: 1000, iterations: 3 },
      );
    }
    this.props.updateJobStatus();
  };

  render() {
    return (
      <Tooltip
        className={f('large-1', 'columns')}
        title="Manually refresh job information"
      >
        <button
          className={f('button', 'medium', 'float-right')}
          aria-label="Manually refresh job information"
          onClick={this._handleClick}
        >
          <span
            className={f('icon', 'icon-functional')}
            data-icon="R"
            ref={node => (this._icon = node)}
          />
        </button>
      </Tooltip>
    );
  }
}

export default connect(undefined, { updateJobStatus })(RefreshButton);
