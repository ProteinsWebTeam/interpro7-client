import React, {Component, PropTypes as T, Children} from 'react';
import {foundationPartial} from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

class Tabs extends Component {
  constructor(props){
    super(props);
    this.state = {activeTab: 0};
  }
  handleChangeTab = index => () => (
    this.setState({activeTab: index})
  );

  render() {
    const {children} = this.props;
    const _children = Children.toArray(children);
    return (
      <div>
        <ul className={f('tabs')}>
          {
            _children.map((child, i) => (
              <li
                className={f(
                  'tabs-title', {
                    'is-active': this.state.activeTab === i,
                  })}
                key={i}
              >
                <button onClick={this.handleChangeTab(i)}>
                  {child.props.title}
                </button>
              </li>
            ))
          }
        </ul>

        <div
          className={f('tabs', 'tabs-content')}
        >
          {
            _children.map((child, i) => (
              <div
                key={i}
                className={f('tabs-panel', {
                  'is-active': this.state.activeTab === i,
                }) + (` ${child.props.className}` || '')}
              >
                {child.props.children}
              </div>
            ))
          }
        </div>
      </div>
    );
  }

}
Tabs.propTypes = {
  children: T.any,
};
export default Tabs;
