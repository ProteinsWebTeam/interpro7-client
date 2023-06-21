import React, {
  PureComponent,
  Children,
  ReactElement,
  PropsWithChildren,
} from 'react';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const css = cssBinder(fonts, ipro, style);

type Props = PropsWithChildren<{
  selectedTab?: string;
  onTabSelected?: (tab: string) => void;
}>;

type State = {
  activeTab: number;
};
export default class Tabs extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeTab: 0 };
  }

  _handleChangeTab = (index: number) => () => {
    const { children, onTabSelected } = this.props;
    if (onTabSelected) {
      const id =
        (Children.toArray(children)?.[index] as ReactElement)?.props?.title ||
        '';
      onTabSelected(id);
    } else {
      this.setState({ activeTab: index });
    }
  };

  render() {
    const { children, selectedTab } = this.props;
    const _children = Children.toArray(children);
    const index = _children.findIndex(
      (ch) =>
        (ch as ReactElement).props.title.toLowerCase() ===
        selectedTab?.toLowerCase()
    );
    const activeTab = index >= 0 ? index : this.state.activeTab;
    const _child = _children[activeTab] as ReactElement;
    return (
      <div>
        <ul className={css('tabs', 'main-style')}>
          {_children.map((child, i) => (
            <li
              className={css('tabs-title', { 'is-active': activeTab === i })}
              key={i}
            >
              <button
                onClick={this._handleChangeTab(i)}
                data-testid={
                  'data-testid' in (child as ReactElement).props
                    ? (child as ReactElement).props['data-testid']
                    : null
                }
              >
                {(child as ReactElement).props.title}
              </button>
            </li>
          ))}
        </ul>

        <div className={css('tabs', 'tabs-content')}>
          <div
            className={[
              css('tabs-panel', 'is-active'),
              _child.props.className || '',
            ]
              .join(' ')
              .trim()}
          >
            {_child.props.children}
          </div>
        </div>
      </div>
    );
  }
}
