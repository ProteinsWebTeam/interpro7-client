import React from 'react';

import loadData from 'higherOrder/loadData/ts';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Card from 'components/SimpleCommonComponents/Card';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { unescape } from 'utils/text';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './styles.css';
import cards from 'components/SimpleCommonComponents/Card/styles.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const css = cssBinder(fonts, local, cards, buttonCSS);

const BLOG_ROOT = 'https://proteinswebteam.github.io/interpro-blog';

type BlogEntryProps = {
  category: string;
  author?: string;
  excerpt: string;
  title: string;
  url: string;
  published?: string;
  image_category:
    | 'default'
    | 'biology'
    | 'protein'
    | 'technical'
    | 'website'
    | 'newweb'
    | 'newskin'
    | 'iceberg'
    | 'type';
};

export const BlogEntry = ({
  category,
  author,
  excerpt,
  title,
  url,
  published,
  image_category: imageCategory,
}: BlogEntryProps) => {
  const maxString = 10;
  return (
    <Card
      imageIconClass={css(`image-blog-${imageCategory || 'default'}`)}
      imageComponent={
        <div
          className={css(
            'card-tag',
            `tag-${category === 'focus' ? 'focus' : 'blog'}`,
          )}
        >
          <Tooltip
            title={`View all ${
              category === 'focus' ? 'Protein focus' : 'Blog articles'
            }`}
          >
            <Link
              href={`${BLOG_ROOT}/categories/${category}/`}
              target="_blank"
              className={css('white-link')}
            >
              {category === 'focus' ? 'Protein focus' : 'Blog'}
            </Link>
          </Tooltip>
        </div>
      }
      title={
        <Link href={url} target="_blank">
          {title}
        </Link>
      }
      subHeader={
        <>
          {author && (
            <div className={css('card-info-author')}>
              <em className={css('icon', 'icon-common')} data-icon="&#xf007;" />{' '}
              {author && ` ${author}`}{' '}
            </div>
          )}

          {published && (
            <div
              className={css('icon', 'icon-common')}
              data-icon="&#xf073;"
              aria-label="Date"
            >
              {' '}
              {published.substring(0, maxString)}
            </div>
          )}
        </>
      }
      linkForMore={url}
    >
      <div
        className={css('description')}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: unescape(excerpt) }}
      />
    </Card>
  );
};

interface LoadedProps
  extends LoadDataProps<{
    [key: string]: BlogEntryProps;
  }> {}

export const BlogEntries = ({ data }: LoadedProps) => {
  if (!data) return null;
  const { loading, payload } = data;
  if (loading) return 'Loading…';
  if (!payload) return null;
  const minWidth = 300;

  return (
    <section>
      <ResizeObserverComponent measurements={['width']} element="div">
        {({ width }: { width: number }) => (
          <div className={css('blogs-container', 'vf-grid')}>
            {Object.entries(payload)
              .slice(0, Math.min(width / minWidth))
              .map(([type, content]) => (
                <BlogEntry {...content} key={type} />
              ))}
          </div>
        )}
      </ResizeObserverComponent>
      <div className={css('blogs-container', 'vf-grid', 'read-all')}>
        <Link href={`${BLOG_ROOT}`} target="_blank" buttonType="primary">
          Read all articles
        </Link>
      </div>
    </section>
  );
};

export default loadData({
  getUrl: () => `${BLOG_ROOT}/feed.json`,
  fetchOptions: {
    responseType: 'json',
    useCache: false,
  },
})(BlogEntries);
