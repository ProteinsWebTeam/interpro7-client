import React, { PureComponent } from 'react';

import Description from '..';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import styles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(styles, fonts, ipro);

type DescriptionReadMoreProps = {
  text: string;
  minNumberOfCharToShow: number;
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
          <button
            className={css(
              'vf-button',
              'vf-button--secondary',
              'vf-button--sm'
            )}
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
          </button>
        )}
      </>
    );
  }
}

export default DescriptionReadMore;
