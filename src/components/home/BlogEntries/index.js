// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { unescape } from 'utils/text';

import { foundationPartial } from 'styles/foundation';

import interpro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, interpro, theme, local);

const BLOG_ROOT = 'https://proteinswebteam.github.io/interpro-blog';

/*:: type BlogEntryProps = {
 category: string,
 author?: string,
 excerpt: string,
 title: string,
 url: string,
 published: string,
 }; */

export class BlogEntry extends PureComponent /*:: <BlogEntryProps> */ {
  static propTypes = {
    category: T.string.isRequired,
    author: T.string,
    excerpt: T.string.isRequired,
    title: T.string.isRequired,
    url: T.string.isRequired,
    published: T.string,
  };

  render() {
    const { category, author, excerpt, title, url, published } = this.props;
    const maxString = 10;
    return (
      <div className={f('flex-card')}>
        <div
          className={f(
            'card-image',
            // TODO Generate and use image from Blog directly - only possible if the blog can resize originals
            `${url.includes('2017/09/22') ? 'image-focus-ape' : ''}`,
            `${url.includes('2017/10/03') ? 'image-blog-type' : ''}`,
            `${url.includes('2017/07/06') ? 'image-blog-newskin' : ''}`,
            `${url.includes('2017/01/23') ? 'image-blog-iceberg' : ''}`,
            `${
              url.includes('2018/11/01') ? 'image-blog-newweb' : ''
            }` /* not published yet*/,
          )}
        >
          <div
            className={f(
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
                className={f('white-link')}
              >
                {category === 'focus' ? 'Protein focus' : 'Blog'}
              </Link>
            </Tooltip>
          </div>
        </div>

        <div className={f('card-content')}>
          <div className={f('card-title')}>
            <h4>
              <Link href={url} target="_blank">
                {title}
              </Link>
            </h4>
          </div>
          <div className={f('card-info')}>
            {author && (
              <div className={f('card-info-author')}>
                <em className={f('icon', 'icon-common')} data-icon="&#xf007;" />{' '}
                {author && ` ${author}`}{' '}
              </div>
            )}

            {published && (
              <div
                className={f('card-info-date', 'icon', 'icon-common')}
                data-icon="&#xf073;"
                aria-label="Date"
              >
                {' '}
                {published.substring(0, maxString)}
              </div>
            )}
          </div>
          <div
            className={f('card-description')}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: unescape(excerpt) }}
          />
        </div>
        <Link href={url} target="_blank" className={f('card-more')}>
          <div
            className={f('button-more', 'icon', 'icon-common', 'icon-right')}
            data-icon="&#xf061;"
          >
            Read more
          </div>
        </Link>
      </div>
    );
  }
}

/*:: type BlogEntriesProps = {
 data: {
 loading: boolean,
 payload?: Object,
 },
 }; */

class BlogEntries extends PureComponent /*:: <BlogEntriesProps> */ {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
  };

  render() {
    const {
      data: { loading, payload },
    } = this.props;
    if (loading) return 'Loading…';
    if (!payload) return null;
    return (
      <section>
        <div className={f('flex-column')}>
          {Object.entries(payload).map(([type, content]) => (
            <BlogEntry key={type} {...content} />
          ))}
        </div>
        <div className={f('flex-column', 'read-all')}>
          <Link href={`${BLOG_ROOT}`} target="_blank">
            <div className={f('button', 'margin-bottom-none')}>
              Read all articles
            </div>
          </Link>
        </div>
      </section>
    );
  }
}

// export default loadData(() => `${BLOG_ROOT}/feed-first-of-each.json`)(
export default loadData(() => `${BLOG_ROOT}/feed.json`)(BlogEntries);
