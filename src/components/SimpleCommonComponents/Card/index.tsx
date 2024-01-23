import React, { PropsWithChildren, ReactElement } from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import local from './styles.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

type Props = PropsWithChildren<{
  title?: ReactElement | string;
  imageIconClass?: string;
  imageComponent?: ReactElement;
  footer?: ReactElement | string;
  linkForMore?: string;
  labelForMore?: string;
}>;

export const Card = ({
  title,
  imageComponent,
  imageIconClass,
  footer,
  linkForMore,
  labelForMore,
  children,
}: Props) => {
  return (
    <div className={css('new-card')}>
      {(imageComponent || imageIconClass || title) && (
        <header>
          {(imageComponent || imageIconClass) && (
            <div
              className={css('image', imageIconClass, {
                icon: !!imageIconClass,
              })}
            >
              {imageComponent}
            </div>
          )}
          {title && (
            <div className={css('title')}>
              <h5>{title}</h5>
            </div>
          )}
        </header>
      )}
      <section className={css('content')}>{children}</section>
      {(footer || linkForMore) && (
        <>
          <div className={css('footer')}>{footer}</div>
          {linkForMore && (
            <div className={css('card-more')}>
              <Link href={linkForMore} target="_blank">
                <div
                  className={css(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                >
                  {labelForMore || 'See more'}
                </div>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Card;
