// @flow
import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import restructured from 'restructured';
import config from 'config';
import loadable from 'higherOrder/loadable';

import { getReadTheDocsURL } from 'higherOrder/loadData/defaults';

// $FlowFixMe
import pathToDescription from 'utils/processDescription/pathToDescription';
import Link from 'components/generic/Link';

const InterProScan = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "about-interproscan" */ 'components/About/InterProScan'
    ),
});

const substitutions = {};

const rstembeddedLink = /`(.+)\s*<(.+)>`_{1,2}/;
// eslint-disable-next-line complexity
const Switch = ({ type, ...rest }) => {
  switch (type) {
    case 'section':
      return <Section {...rest} />;
    case 'title':
      return <Title {...rest} />;
    case 'paragraph':
      return <BasicWrapper {...rest} Element="p" />;
    case 'reference':
      return <Reference {...rest} />;
    case 'bullet_list':
      return <BasicWrapper {...rest} Element="ul" />;
    case 'enumerated_list':
      return <BasicWrapper {...rest} Element="ol" />;
    case 'line_block':
      return <BasicWrapper {...rest} Element="div" />;
    case 'line':
      return <BasicWrapper {...rest} Element="div" />;
    case 'list_item':
      return <BasicWrapper {...rest} Element="li" />;
    case 'block_quote':
      return (
        <BasicWrapper {...rest} Element="blockquote" respectNewLines={true} />
      );
    case 'comment':
      return <Comment {...rest} />;
    case 'directive':
      if (['image', 'figure'].includes(rest.directive)) {
        return <Image {...rest} />;
      } else if (
        rest.directive === 'raw' &&
        rest.children?.[0]?.value === 'html'
      ) {
        const html = rest.children
          .slice(1)
          .filter(({ type }) => type === 'text')
          .map(({ value }) => value)
          .join('');
        return (
          <div
            className="content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      }
      break;
    case 'interpreted_text':
      return <Substitution {...rest} />;
    case 'substitution_reference':
      return <Substitution {...rest} />;
    case 'strong':
      return <BasicWrapper {...rest} Element="strong" />;
    case 'text': {
      if (rest.value.trim() === '|') return null;
      if (rest.respectNewLines && rest.value.endsWith('\n')) {
        return (
          <>
            {rest.value}
            <br />
          </>
        );
      }

      const matches = rstembeddedLink.exec(rest.value);
      if (matches === null) return rest.value;

      const [_, text, link] = matches;
      return (
        <a target="_blank" href={link} rel="noreferrer">
          {text}
        </a>
      );
    }
    default:
      return null;
  }
  return null;
};
Switch.propTypes = {
  type: T.string,
};

const rstLinkRegexp = /(.+) <(.+)>/;
const Substitution = ({ children, role }) => {
  const ref = children
    ?.filter(({ type }) => type === 'text')
    .reduce((agg, v) => agg + v?.value?.replace('\n', ''), '');
  if (['ref', 'doc'].includes(role)) {
    let url = null;
    let text = null;
    const matches = rstLinkRegexp.exec(ref);
    if (matches) {
      const [_, label, key] = matches;
      url = substitutions[key] || `${key}.html`;
      text = label;
    } else if (ref in substitutions) {
      url = substitutions[ref];
      text = ref.replace(/_/g, ' ');
    }
    return url ? (
      <a
        target="_blank"
        href={config.root.readthedocs.href + url}
        rel="noreferrer"
        style={{
          textTransform: 'capitalize',
        }}
      >
        {text}
      </a>
    ) : (
      text
    );
  }
  if (ref in substitutions) {
    const Substitute = () => substitutions[ref];
    return <Substitute />;
  }

  return null;
};
Substitution.propTypes = {
  children: T.array,
  role: T.string,
};

const substitutionRegExp = /\|(.+)\| (.+):: (.+)/;
const refRegExp = /:ref:(.+) (.+)/;
const Comment = ({ children }) => {
  const mainComment = children?.[0]?.value || '';
  let matches = substitutionRegExp.exec(mainComment);
  if (matches) {
    const [_, ref, type, value] = matches;
    if (type === 'image') {
      substitutions[ref] = <Image>{[{ value }, ...children.slice(1)]}</Image>;
    }
  } else {
    matches = refRegExp.exec(mainComment) || [];
    const [_, ref, link] = matches;
    substitutions[ref] = link;
  }
  return null;
};
Comment.propTypes = {
  children: T.array,
};

const attrRegExp = /:(.+):(.+)/;
const Image = ({ children }) => {
  const imagePath = children?.[0]?.value;
  if (imagePath) {
    const attributes = Object.fromEntries(
      children
        .slice(1)
        .map(({ value }) =>
          (attrRegExp.exec(value) || []).slice(1).map((e) => e.trim()),
        ),
    );
    return (
      <img
        {...attributes}
        src={getReadTheDocsURL(imagePath)()}
        alt="from RST"
      />
    );
  }
  return null;
};
Image.propTypes = {
  children: T.array,
};

const BasicWrapper = ({ children, Element = 'span', ...rest }) => (
  <Element>
    <Children {...rest}>{children}</Children>
  </Element>
);
BasicWrapper.propTypes = {
  children: T.array,
  Element: T.string,
};

const INTERPRO_URL = 'www.ebi.ac.uk/interpro';
const referenceRegExp = /(.*)<(.+)>/;
const Reference = ({ children }) => {
  if (!children || !children.length) return null;
  const EXPECTED_GROUPS = 3;
  let url = '';
  let text = '';
  switch (children.length) {
    case 1: {
      const raw = children[0].value;
      const matches = referenceRegExp.exec(raw) || [];
      if (matches.length === EXPECTED_GROUPS) {
        text = matches[1].trimEnd();
        url = matches[2];
      }

      break;
    }
    case 2:
      text = children[0].value;
      url = children[1].value.trim().slice(1, -1);
      break;
    default:
      return <Children>{children}</Children>;
  }
  if (url.includes(INTERPRO_URL)) {
    const path = new RegExp(`.+${INTERPRO_URL}(.*)`).exec(url)?.[1];
    if (path) {
      const [justPath, hash] = path.split('#');
      return (
        <Link to={{ description: pathToDescription(justPath), hash }}>
          {text || url}
        </Link>
      );
    }
  }
  return (
    <a target="_blank" href={url} rel="noreferrer">
      {text || url}
    </a>
  );
};
Reference.propTypes = {
  children: T.array,
};

const MAX_HEADER = 3;
const Title = ({ depth, children }) => {
  const Tag = `h${MAX_HEADER + depth - 1}`;
  return (
    <Tag>
      <Children>{children}</Children>
    </Tag>
  );
};
Title.propTypes = {
  children: T.array,
  depth: T.number,
};
const Faq = ({ children }) => {
  const summary = children.find(({ type }) => type === 'title')?.children?.[0]
    .value;
  return (
    <details className="accordion-style">
      <summary>{summary}</summary>
      <div className="accordion-info">
        <Children>{children.filter(({ type }) => type !== 'title')}</Children>
      </div>
    </details>
  );
};
Faq.propTypes = {
  children: T.array,
};

const LEVEL_FOR_FAQ = 3;
const Section = ({ depth, children, ...rest }) => {
  if (rest.format === 'faq' && depth === LEVEL_FOR_FAQ) {
    return <Faq>{children}</Faq>;
  }
  const shouldIncludeIscan =
    rest.format === 'interproscan' &&
    children?.[0]?.children?.[0]?.value === 'Documentation';
  return (
    <section>
      {shouldIncludeIscan && <InterProScan />}
      <Children {...rest} depth={depth}>
        {children}
      </Children>
    </section>
  );
};
Section.propTypes = {
  children: T.array,
  depth: T.number,
};

class ErrorBoundary extends React.Component /*:: <{element: {}, children: any}, {hasError: boolean}> */ {
  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  static propTypes = {
    element: T.object,
    children: T.any,
  };

  state = { hasError: false };

  render() {
    if (this.state.hasError) {
      console.log('Element', this.props.element);
      return (
        <div
          style={{
            fontFamily: 'monospace',
            display: 'inline-block',
            background: 'lightgray',
            color: 'chocolate',
          }}
        >
          [ Parse Error ]
        </div>
      );
    }
    return this.props.children;
  }
}
const Children = ({ children, ...rest }) =>
  children?.length
    ? children.map((child, i) => (
        <ErrorBoundary key={i} element={child}>
          <Switch {...rest} {...child} />
        </ErrorBoundary>
      ))
    : null;
Children.propTypes = {
  children: T.array,
};

const ContentFromRST = ({ rstText, format }) => {
  const [_, setHasSubstitutions] = useState(false);
  useEffect(() => {
    if (Object.keys(substitutions).length) setHasSubstitutions(true);
  });
  const doc = restructured.parse(rstText);
  if (!doc?.type || doc.type !== 'document' || !doc?.children?.length)
    return null;

  // console.log(doc);
  return (
    <div>
      <Children format={format}>{doc.children}</Children>
    </div>
  );
};
ContentFromRST.propTypes = {
  rstText: T.string.isRequired,
  format: T.string,
};

export default React.memo(ContentFromRST);
