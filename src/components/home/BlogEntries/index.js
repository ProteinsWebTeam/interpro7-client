import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import interpro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, interpro, theme, local);

const BLOG_ROOT = 'https://proteinswebteam.github.io/interpro-blog';

const unescape = text =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

export class BlogEntry extends PureComponent {
  static propTypes = {
    category: T.string.isRequired,
    author: T.string,
    excerpt: T.string.isRequired,
    title: T.string.isRequired,
    url: T.string.isRequired,
  };

  render() {
    const { category, author, excerpt, title, url } = this.props;
    return (
      <div className={f('columns')}>
        <div className={f('callout')}>
          <h5>
            <Link href={`${BLOG_ROOT}/categories/${category}/`} target="_blank">
              {category === 'focus' ? 'Protein focus' : 'Blog'}
            </Link>
          </h5>
          <h6>
            <Link href={url} target="_blank">
              {title}
            </Link>
            {author && ` by ${author}`}
          </h6>
          <blockquote
            className={f('content')}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: unescape(excerpt) }}
          />
          <Link href={url} target="_blank" className={f('button')}>
            Read more
          </Link>
        </div>
      </div>
    );
  }
}

class BlogEntries extends PureComponent {
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
      <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>
        {Object.entries(payload).map(([type, content]) => (
          <BlogEntry key={type} {...content} />
        ))}
      </div>
    );
  }
}

export default loadData(() => `${BLOG_ROOT}/feed-first-of-each.json`)(
  BlogEntries,
);
