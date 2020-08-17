import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import restructured from 'restructured';

import { getReadTheDocsURL } from 'higherOrder/loadData/defaults';

import pathToDescription from 'utils/processDescription/pathToDescription';
import Link from 'components/generic/Link';

const substitutions = {};

const Switch = ({ type, ...rest }) => {
  switch (type) {
    case 'section':
      return <Section {...rest} />;
    case 'title':
      return <Title {...rest} />;
    case 'paragraph':
      return <Paragraph {...rest} />;
    case 'reference':
      return <Reference {...rest} />;
    case 'bullet_list':
      return <BulletList {...rest} />;
    case 'enumerated_list':
      return <EnumeratedList {...rest} />;
    case 'list_item':
      return <ListItem {...rest} />;
    case 'comment':
      return <Comment {...rest} />;
    case 'directive':
      if (rest.directive === 'image') {
        return <Image {...rest} />;
      }
      break;
    case 'substitution_reference':
      return <Substitution {...rest} />;
    case 'text':
      return rest.value;
    default:
      return null;
  }
};
Switch.propTypes = {
  type: T.string,
};

const Substitution = ({ children }) => {
  const ref = children?.[0]?.value;
  if (ref in substitutions) {
    const Substitute = () => substitutions[ref];
    return <Substitute />;
  }
  return null;
};
Substitution.propTypes = {
  children: T.array,
};

const substitutionRegExp = /\|(.+)\| (.+):: (.+)/;
const Comment = ({ children }) => {
  const mainComment = children?.[0]?.value || '';
  const matches = substitutionRegExp.exec(mainComment);
  if (matches) {
    const [_, ref, type, value] = matches;
    if (type === 'image') {
      substitutions[ref] = <Image>{[{ value }, ...children.slice(1)]}</Image>;
    }
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
      children.slice(1).map(({ value }) =>
        attrRegExp
          .exec(value)
          .slice(1)
          .map((e) => e.trim()),
      ),
    );
    return (
      <img
        src={getReadTheDocsURL(imagePath)()}
        alt="from RST"
        {...attributes}
      />
    );
  }
};
Image.propTypes = {
  children: T.array,
};

const ListItem = ({ children }) => (
  <li>
    <Children>{children}</Children>
  </li>
);
ListItem.propTypes = {
  children: T.array,
};

const BulletList = ({ children }) => (
  <ul>
    <Children>{children}</Children>
  </ul>
);
BulletList.propTypes = {
  children: T.array,
};

const EnumeratedList = ({ children }) => (
  <ol>
    <Children>{children}</Children>
  </ol>
);
EnumeratedList.propTypes = {
  children: T.array,
};

const INTERPRO_URL = 'www.ebi.ac.uk/interpro';
const Reference = ({ children }) => {
  if (!children || !children.length) return null;

  if (children.length > 1) {
    return <Children>{children}</Children>;
  }
  const raw = children[0].value;
  const re = /(.*)<(.+)>/;
  const matches = re.exec(raw);
  const EXPECTED_GROUPS = 3;
  if (matches.length === EXPECTED_GROUPS) {
    const [_, text, url] = matches;
    if (url.includes(INTERPRO_URL)) {
      const path = new RegExp(`.+${INTERPRO_URL}(.*)`).exec(url)?.[1];
      if (path) {
        return (
          <Link to={{ description: pathToDescription(path) }}>
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
  }
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

const Section = ({ depth, children }) => (
  <section>
    <Children depth={depth}>{children}</Children>
  </section>
);
Section.propTypes = {
  children: T.array,
  depth: T.number,
};
const Paragraph = ({ depth, children }) => (
  <p>
    <Children depth={depth}>{children}</Children>
  </p>
);
Paragraph.propTypes = {
  children: T.array,
  depth: T.number,
};

const Children = ({ children, depth }) =>
  children?.length
    ? children.map((child, i) => <Switch key={i} depth={depth} {...child} />)
    : null;
Children.propTypes = {
  children: T.array,
  depth: T.number,
};

const ContentFromRST = ({ rstText }) => {
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
      <Children>{doc.children}</Children>
    </div>
  );
};
ContentFromRST.propTypes = {
  rstText: T.string,
};

export default React.memo(ContentFromRST);
