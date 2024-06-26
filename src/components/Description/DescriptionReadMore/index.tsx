import React, { PureComponent } from 'react';

import Description from '..';
import { Button } from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import styles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(styles, fonts, ipro);

type DescriptionReadMoreProps = {
  /**
   * Text to display
   */
  text: string;
  /**
   * The number of character to show when the description is compacted.
   */
  minNumberOfCharToShow: number;
  /**
   * A `string` or `regex` that needs to be removed on the whole document. Currently used to remove reference marks when unnecessary.
   */
  patternToRemove?: string;
};

type State = { showMore: boolean };

class DescriptionReadMore extends PureComponent<
  DescriptionReadMoreProps,
  State
> {
  constructor(props: DescriptionReadMoreProps) {
    super(props);
    this.state = { showMore: false };
  }
  render() {
    const {
      text = '',
      minNumberOfCharToShow = Infinity,
      patternToRemove,
    } = this.props;
    const { showMore } = this.state;
    let textToShow = text;
    if (patternToRemove) {
      textToShow = textToShow.replace(new RegExp(patternToRemove, 'g'), '');
    }
    textToShow =
      showMore || minNumberOfCharToShow > textToShow.length
        ? textToShow
        : `${textToShow.slice(0, minNumberOfCharToShow)}...`;
    return (
      <>
        <Description textBlocks={[textToShow]} {...this.props} />
        {minNumberOfCharToShow < text.length && (
          <Button
            type="tertiary"
            onClick={() => this.setState({ showMore: !showMore })}
          >
            Show{' '}
            {showMore ? (
              <span>
                Less{' '}
                <i
                  className={css('icon', 'icon-common', 'font-s')}
                  data-icon="&#xf102;"
                />
              </span>
            ) : (
              <span>
                More{' '}
                <i
                  className={css('icon', 'icon-common', 'font-s')}
                  data-icon="&#xf103;"
                />
              </span>
            )}
          </Button>
        )}
      </>
    );
  }
}

export default DescriptionReadMore;
