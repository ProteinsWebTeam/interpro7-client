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
  subHeader?: ReactElement | string;
  footer?: ReactElement | string;
  linkForMore?: string;
  labelForMore?: string;
  compact?: boolean;
}>;

export const Card = ({
  title,
  imageComponent,
  imageIconClass,
  subHeader,
  footer,
  linkForMore,
  labelForMore,
  compact = false,
  children,
}: Props) => {
  return (
    <div className={css('new-card', { compact })}>
      {(imageComponent || imageIconClass || title || subHeader) && (
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
          {title && <div className={css('title')}>{title}</div>}
          {subHeader && <div className={css('subheader')}>{subHeader}</div>}
        </header>
      )}
      <section className={css('content')}>{children}</section>
      {(footer || linkForMore) && (
        <>
          <div className={css('footer')}>
            {footer}
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
                    data-icon="&#xf061;"
                  >
                    {labelForMore || 'See more'}
                  </div>
                </Link>
              </div>
            )}{' '}
          </div>
        </>
      )}
    </div>
  );
};
export default Card;
