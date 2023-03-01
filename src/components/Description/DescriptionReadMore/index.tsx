import React, { PureComponent } from 'react';

import Description from '..';

import { foundationPartial } from 'styles/foundation';

import styles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(styles, fonts);

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
            className={f('button', 'hollow', 'secondary', 'margin-bottom-none')}
            onClick={() => this.setState({ showMore: !showMore })}
          >
            Show{' '}
            {showMore ? (
              <span>
                Less{' '}
                <i
                  className={f('icon', 'icon-common', 'font-sm')}
                  data-icon="&#xf102;"
                />
              </span>
            ) : (
              <span>
                More{' '}
                <i
                  className={f('icon', 'icon-common', 'font-sm')}
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
