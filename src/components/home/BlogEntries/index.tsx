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
  feed_type?: string;
  category: string;
  author?: string;
  excerpt: string;
  title: string;
  url: string;
  published?: string;
  date?: string;
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
  feed_type,
}: BlogEntryProps) => {
  const maxString = 10;
  return (
    <Card
      imageIconClass={css(`image-blog-${imageCategory || 'default'}`)}
      imageComponent={
        feed_type !== 'embl-news' ? (
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
        ) : (
          <></>
        )
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

type EMBLArticle = {
  title: string;
  teaser: string;
  url: string;
  created: string;
};

interface LoadedProps
  extends LoadDataProps,
    LoadDataProps<BlogEntryProps[], 'Feed'>,
    LoadDataProps<{ rows: EMBLArticle[] }, 'EMBL'> {}

const EMBLFeedStandardizer = (dataEMBL: EMBLArticle[]): BlogEntryProps[] => {
  const newDataEMBL: BlogEntryProps[] = [];

  dataEMBL.map((article) => {
    const newArticle: BlogEntryProps = {
      title: article['title'],
      author: 'EMBL-EBI',
      excerpt: article['teaser'],
      category: 'interpro',
      url: article['url'],
      image_category: 'website',
      date: article['created'],
      feed_type: 'embl-news',
    };
    newDataEMBL.push(newArticle);
  });
  return newDataEMBL;
};

const addArticleCreationDate = (
  dataFeed: BlogEntryProps[],
): BlogEntryProps[] => {
  dataFeed.map((article) => {
    const match = article.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
    if (match) {
      const [_, year, month, day] = match;
      const formatted = `${year}-${month}-${day}T00:00:00+0000`;
      article.date = formatted;
    }
  });
  return dataFeed;
};

const sortArticlesByDate = (
  articleA: BlogEntryProps,
  articleB: BlogEntryProps,
) => {
  if (articleA.date && articleB.date) {
    if (articleA.date > articleB.date) return -1;
    if (articleA.date <= articleB.date) return 1;
  }
  return 0;
};

export const BlogEntries = ({ dataFeed, dataEMBL }: LoadedProps) => {
  if (!dataFeed?.payload && !dataEMBL?.payload) return null;
  if (dataFeed?.loading || dataEMBL?.loading) return 'Loading..';
  const minWidth = 300;

  const emblArticles: EMBLArticle[] = dataEMBL?.payload?.rows || [];
  const blogArticles = addArticleCreationDate(dataFeed?.payload || []);
  const fullFeed = EMBLFeedStandardizer(emblArticles)
    .concat(blogArticles)
    .sort(sortArticlesByDate);

  return (
    <section>
      <ResizeObserverComponent measurements={['width']} element="div">
        {({ width }: { width: number }) => (
          <div className={css('blogs-container', 'vf-grid')}>
            {dataFeed?.payload &&
              dataEMBL?.payload &&
              Object.entries(fullFeed)
                .slice(0, Math.min(width / minWidth))
                .map(([type, content]) => <BlogEntry {...content} />)}
          </div>
        )}
      </ResizeObserverComponent>
      <div className={css('blogs-container', 'vf-grid', 'read-all')}>
        {/* <Link href={`${BLOG_ROOT}`} target="_blank" buttonType="primary">
          Read all articles
        </Link> */}
      </div>
    </section>
  );
};

export default loadData({
  getUrl: () =>
    'https://www.embl.org/api/v1/news?source=contenthub&title=interpro&site=embl-ebi&items_per_page=10',
  propNamespace: 'EMBL',
  fetchOptions: {
    responseType: 'json',
    useCache: false,
  },
})(
  loadData({
    getUrl: () => `${BLOG_ROOT}/feed.json`,
    propNamespace: 'Feed',
    fetchOptions: {
      responseType: 'json',
      useCache: false,
    },
  })(BlogEntries),
);
