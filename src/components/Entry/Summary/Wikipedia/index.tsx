import React from 'react';

import ReactHtmlParser from 'react-html-parser';
import { XMLParser } from 'fast-xml-parser';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData/ts';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import local from '../style.css';
import { Params } from 'src/higherOrder/loadData/extract-params';

const css = cssBinder(local);

interface WikipediaProps
  extends WikipediaEntry,
    LoadDataProps<WikipediaPayload> {}

type ParserPart = {
  name: string;
  value: string | Record<string, string>;
};
const Wikipedia = ({ title, extract, thumbnail, data }: WikipediaProps) => {
  if (data.loading && !data.payload) return <Loading />;

  const identifiers: Array<ParserPart> = [];
  const article: Record<string, string> = {};
  const properties = ['symbol', 'name', 'image', 'width', 'caption', 'pdb'];

  const result = data.payload;
  if (!result) return null;

  const xmlParser = new XMLParser();
  const json = xmlParser.parse(result.parse.parsetree['*']);
  let parts: Array<ParserPart> = [];
  let infoStatus = false;
  if (json.root.template?.length > 0) {
    json.root.template.forEach(
      (obj: { part: Array<ParserPart>; title: string }) => {
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
      }
    );
  }

  parts.forEach((part) => {
    if (part.value) {
      if (properties.includes(part.name.toLowerCase())) {
        article[part.name] = typeof part.value === 'string' ? part.value : '';
        if (part.name === 'caption') {
          if (typeof part.value === 'object') {
            article.caption = part.value['#text'];
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
    <div className={css('wiki-article')}>
      <div className={css('vf-grid', 'wiki-content')}>
        <div className={css('vf-grid__col--span-3', 'columns')}>
          <h4>
            <Link
              className={css('ext')}
              target="_blank"
              href={`https://en.wikipedia.org/wiki/${title}`}
            >
              {title.replace(/_/g, ' ')}
            </Link>{' '}
            <div className={css('tag')}>Wikipedia</div>
          </h4>
          {ReactHtmlParser(extract)}
        </div>
        <div className={css('columns')}>
          <table className={css('infobox')}>
            <tbody>
              <tr>
                <th colSpan={2} className={css('th-infobox')}>
                  {article.Name ? article.Name : title.replace(/_/g, ' ')}
                </th>
              </tr>
              {thumbnail ? (
                <tr>
                  <td colSpan={2} className={css('td-thumbnail')}>
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
                    <th colSpan={2} className={css('th-identifier')}>
                      Identifiers
                    </th>
                  </tr>
                  <tr>
                    <th scope="row" className={css('row-header')}>
                      Symbol
                    </th>
                    <td className={css('row-data')}>
                      {article.Symbol ? article.Symbol : title}
                    </td>
                  </tr>
                  {identifiers.map((id) => {
                    const value = typeof id.value === 'string' ? id.value : '';
                    return (
                      <tr key={id.name}>
                        <th scope="row" className={css('row-header')}>
                          <a
                            href={`https://en.wikipedia.org/wiki/${id.name}`}
                            title={id.name}
                          >
                            {id.name}
                          </a>
                        </th>
                        <td className={css('row-data')}>{value}</td>
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

const getWikiUrl = createSelector(
  (state: GlobalState) => state.settings.wikipedia,
  (_state: unknown, props?: WikipediaEntry) => props?.title,
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
  }
);
export default loadData({ getUrl: getWikiUrl } as Params)(Wikipedia);