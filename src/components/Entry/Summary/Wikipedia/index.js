// @flow
import React from 'react';
import T from 'prop-types';

import ReactHtmlParser from 'react-html-parser';
import { XMLParser } from 'fast-xml-parser';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';

import local from '../style.css';

const f = foundationPartial(local);

const Wikipedia = ({ title, extract, thumbnail, data }) => {
  if (data.loading && !data.payload) return <Loading />;

  const identifiers = [];
  const article = {};
  const properties = ['symbol', 'name', 'image', 'width', 'caption', 'pdb'];

  const result = data.payload;
  const xmlParser = new XMLParser();
  const json = xmlParser.parse(result.parse.parsetree['*']);
  let parts = [];
  let infoStatus = false;
  if (json.root.template?.length > 0) {
    json.root.template.forEach((obj) => {
      const possibleTitles = [
        'Infobox protein family',
        'Pfam_box',
        'Pfam box',
        'Infobox enzyme',
      ];
      if (possibleTitles.includes(obj.title) && !infoStatus) {
        parts = obj.part;
        infoStatus = true;
      }
    });
  }

  parts.forEach((part) => {
    if (part.value) {
      if (properties.includes(part.name.toLowerCase())) {
        article[part.name] = part.value;
        if (part.name === 'caption') {
          if (typeof part.value === 'object') {
            article.caption = part.value['#text'];
          } else {
            article.caption = part.value;
          }
        }
      } else {
        identifiers.push(part);
      }
    }
  });

  const imageLink = (
    <img src={`data:image/png;base64, ${thumbnail}`} alt="Structure" />
  );

  return (
    <div className={f('wiki-article')}>
      <div className={f('row', 'wiki-content')}>
        <div className={f('medium-8', 'large-8', 'columns')}>
          <h4>
            <Link
              className={f('ext')}
              target="_blank"
              href={`https://en.wikipedia.org/wiki/${title}`}
            >
              {title.replace(/_/g, ' ')}
            </Link>{' '}
            <div className={f('tag')}>Wikipedia</div>
          </h4>
          {ReactHtmlParser(extract)}
        </div>
        <div className={f('medium-4', 'large-4', 'columns')}>
          <table className={f('infobox')}>
            <tbody>
              <tr>
                <th colSpan="2" className={f('th-infobox')}>
                  {article.Name ? article.Name : title.replace(/_/g, ' ')}
                </th>
              </tr>
              {thumbnail ? (
                <tr>
                  <td colSpan="2" className={f('td-thumbnail')}>
                    {article.image ? (
                      <a
                        href={`https://en.wikipedia.org/wiki/File:${article.image}`}
                        className="image"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {imageLink}
                      </a>
                    ) : (
                      imageLink
                    )}
                    <div>{article.caption}</div>
                  </td>
                </tr>
              ) : null}
              {infoStatus ? (
                <>
                  <tr>
                    <th colSpan="2" className={f('th-identifier')}>
                      Identifiers
                    </th>
                  </tr>
                  <tr>
                    <th scope="row" className={f('row-header')}>
                      Symbol
                    </th>
                    <td className={f('row-data')}>
                      {article.Symbol ? article.Symbol : title}
                    </td>
                  </tr>
                  {identifiers.map((id) => {
                    return (
                      <tr key={id.name}>
                        <th scope="row" className={f('row-header')}>
                          <a
                            href={`https://en.wikipedia.org/wiki/${id.name}`}
                            title={id.name}
                          >
                            {id.name}
                          </a>
                        </th>
                        <td className={f('row-data')}>{id.value}</td>
                      </tr>
                    );
                  })}
                </>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
Wikipedia.propTypes = {
  title: T.string,
  extract: T.string,
  thumbnail: T.string,
  data: T.object,
};

const getWikiUrl = createSelector(
  (state) => state.settings.wikipedia,
  (_state, props) => props.title,
  ({ protocol, hostname, port, root }, title) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: root,
      query: {
        origin: '*',
        action: 'parse',
        page: title,
        format: 'json',
        prop: 'parsetree',
      },
    });
  },
);
export default loadData({ getUrl: getWikiUrl })(Wikipedia);
