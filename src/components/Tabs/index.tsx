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
import Button from '../SimpleCommonComponents/Button';

const css = cssBinder(fonts, ipro, style);

type Props = PropsWithChildren<{
  /**
   * string that matches one of the children's titles to select that as the active tab
   */
  selectedTab?: string;
  /**
   * Overwriting the funcionality of the tabs to give another functionality when the tab is selected.
   * Used currently, when the tabs change the URL.
   * @param tab string that matches one of the children's titles
   * @returns void
   */
  onTabSelected?: (tab: string) => void;
}>;

type State = {
  activeTab: number;
};
/**
 * Children of this component will be considered as the content of the tabs
 * and the title on each element will be the label of the tab.
 * e.g.
 * ```
 * <Tabs>
 *       <div title="X">content X</div>,
 *       <div title="Y">content Y</div>,
 * </Tabs>
 * ```
 * will create something like:
 * ```
 * ---------
 * | X | Y |
 * -----------------
 * | Content X     |
 * -----------------
 * ```
 */
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
        selectedTab?.toLowerCase(),
    );
    const activeTab = index >= 0 ? index : this.state.activeTab;
    const _child = _children[activeTab] as ReactElement;
    return (
      <div>
        <ul className={css('new-tabs', 'main-style')}>
          {_children.map((child, i) => (
            <li
              className={css('tabs-title', { 'is-active': activeTab === i })}
              key={i}
            >
              <Button type="hollow" onClick={this._handleChangeTab(i)}>
                {(child as ReactElement).props.title}
              </Button>
            </li>
          ))}
        </ul>

        <div className={css('tab-content')}>
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
