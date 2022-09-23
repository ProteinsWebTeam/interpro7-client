import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import config from 'config';

import loadable from 'higherOrder/loadable';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import Tabs from 'components/Tabs';
import Description from 'components/Description';
import CurrentVersion from 'components/home/CurrentVersion';
import GeneralWarning from 'components/home/GeneralWarning';
import InterProGraphicAnim from 'components/home/InterProGraphicAnim';
import { PrintedInterPro2020 } from 'components/Help/Publication';
import Tip from 'components/Tip';
import Link from 'components/generic/Link';

import { ToolCards } from 'components/home/Tools';
// Functions
import { schedule } from 'timing-functions';

import {
  schemaProcessDataInterpro,
  schemaProcessDataForDB,
} from 'schema_org/processors';

// Style
import { foundationPartial } from 'styles/foundation';
// CSS
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import style from '../style.css';
import local from './style.css';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

// images
import embl from '../../images/thirdparty/funding/logo_embl.png';
import wellcome from '../../images/thirdparty/funding/logo_wellcome.jpg';
import bbsrc from '../../images/thirdparty/funding/logo_bbsrc.png';

// Bind css with style object
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, style, local);

const MAX_DELAY_FOR_TWITTER = 10000;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

// Generate async components
// Search box
const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
});
const SearchByIDA = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-ida" */ 'components/SearchByIDA'),
});
const IPScanSearch = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "ipscan-search", webpackPreload: true */ 'components/IPScan/Search'
    ),
});
// Browse by X box
const ByMemberDatabase = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "by-member-database", webpackPreload: true */ 'components/home/ByMemberDatabase'
    ),
});
const ByEntryType = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "by-entry-type" */ 'components/home/ByEntryType'
    ),
});
const BySpecies = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-species" */ 'components/home/BySpecies'),
});
const ByLatestEntries = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "by-latest-entries", webpackPreload: true */ 'components/home/ByLatestEntries'
    ),
});
const FavouriteEntries = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "favourite-entries" */ 'components/home/FavouriteEntries'
    ),
});
const SearchTerms = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "search-history" */ 'components/home/SearchHistory'
    ),
});
const BlogEntries = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "blog-entries", webpackPreload: true */ 'components/home/BlogEntries'
    ),
});

const Twitter = loadable({
  async loader() {
    await schedule(MAX_DELAY_FOR_TWITTER);
    return import(/* webpackChunkName: "twitter" */ 'components/Twitter');
  },
});

const SchemaOrgDataWithData = loadData(getUrlForMeta)(
  class SchemaOrgDataWithData extends PureComponent {
    static propTypes = {
      data: T.shape({
        payload: T.shape({
          databases: T.object,
        }),
      }).isRequired,
    };

    render() {
      const databases =
        this.props.data &&
        this.props.data.payload &&
        this.props.data.payload.databases;
      if (!databases) return null;
      return (
        <SchemaOrgData
          data={{
            name: 'InterPro',
            location: window.location,
            version: databases && databases.interpro.version,
            releaseDate: databases && databases.interpro.releaseDate,
            description: databases && databases.interpro.description,
          }}
          processData={schemaProcessDataForDB}
        />
      );
    }
  },
);

const CitingInterPro = () => (
  <details className={f('citing-details')}>
    <summary>Citing InterPro</summary>
    <div>
      If you find InterPro useful, please cite the reference that describes this
      work:
      <PrintedInterPro2020 />
    </div>
  </details>
);

const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

const Announcement = () => (
  <div className={f('row')}>
    <div className={f('columns', 'large-12', 'margin-bottom-xlarge')}>
      <div
        className={f('callout', 'info')}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: '2em',
            color: 'darkblue',
            paddingRight: '1rem',
          }}
          className={f('small', 'icon', 'icon-common', 'icon-announcement')}
        />{' '}
        <p>
          <strong>We are the new home for Pfam data</strong>
          <br />
          Since October 5th, we are the official web for Pfam. The Pfam website
          (
          <span href="//pfam.xfam.org" className={f('link', 'disabled')}>
            pfam.xfam.org
          </span>
          ) is now retired.
          <br />A legacy version of the Pfam website will be available at{' '}
          <Link
            href="//pfam-legacy.xfam.org/"
            className={f('ext')}
            target="_blank"
          >
            https://pfam-legacy.xfam.org/
          </Link>{' '}
          until January 2023, when it will be decommissioned. Please notice{' '}
          <Link
            href="//pfam-legacy.xfam.org/"
            className={f('ext')}
            target="_blank"
          >
            pfam-legacy.xfam.org
          </Link>{' '}
          will not receive any updates and will be kept under very low
          maintenance. You can read more about the sunset period in our{' '}
          <Link
            href="//xfam.wordpress.com/2022/08/04/pfam-website-decommission/"
            className={f('ext')}
            target="_blank"
          >
            blog post
          </Link>
          .
        </p>
      </div>
    </div>
  </div>
);
class Home extends PureComponent {
  static propTypes = {
    showSettingsToast: T.bool.isRequired,
    showHelpToast: T.bool.isRequired,
  };

  render() {
    return (
      <>
        {this.props.showSettingsToast ? (
          <Tip
            title="💡 How to edit the website settings?"
            body="To customise settings, click on the ☰ icon at the top right corner and select settings from the menu options"
            toastID="settings"
            settingsName="showSettingsToast"
          />
        ) : null}
        {this.props.showHelpToast ? (
          <Tip
            title="💡 Need help?"
            body={
              <>
                <p>
                  <span
                    className={f('icon', 'icon-common', 'font-l')}
                    data-icon="&#xf02d;"
                  />{' '}
                  You can find all the documentation of our website in{' '}
                  <Link
                    href={config.root.readthedocs.href}
                    className={f('ext')}
                    target="_blank"
                  >
                    Read The Docs
                  </Link>
                </p>
                <p>
                  If you need help about the components of the home page you can
                  visit{' '}
                  <Link
                    href={`${config.root.readthedocs.href}homepage.html`}
                    className={f('ext')}
                    target="_blank"
                  >
                    [this page].
                  </Link>
                </p>
              </>
            }
            toastID="rtdhelp"
            settingsName="showHelpToast"
          />
        ) : null}
        <GeneralWarning />

        <div className={f('row')}>
          <div className={f('columns', 'large-12')}>
            <SchemaOrgData
              data={{ location: window.location, description }}
              processData={schemaProcessDataInterpro}
            />

            <SchemaOrgDataWithData />
            <div className={f('intro-wrapper')}>
              <div className={f('intro-fig')} data-testid="intro-fig">
                <InterProGraphicAnim />
                <CurrentVersion />
              </div>
              <div className={f('intro-content')} data-testid="intro-content">
                <h3>Classification of protein families</h3>
                <Description textBlocks={[description]} />
                <CitingInterPro />
              </div>
            </div>
          </div>
        </div>

        <Announcement />
        <div className={f('row')}>
          <div className={f('columns', 'large-12', 'margin-bottom-xlarge')}>
            <Tabs>
              <div title="Search by sequence">
                <ErrorBoundary>
                  <IPScanSearch />
                </ErrorBoundary>
              </div>
              <div title="Search by text">
                <ErrorBoundary>
                  <SearchByText />
                </ErrorBoundary>
              </div>
              <div title="Search by Domain Architecture">
                <ErrorBoundary>
                  <SearchByIDA />
                </ErrorBoundary>
              </div>
            </Tabs>
          </div>
        </div>
        {
          // Browse entry & entry list
        }
        <div
          className={f(
            'row',
            'small-up-1',
            'medium-up-1',
            'large-up-2',
            'margin-bottom-large',
          )}
        >
          <div className={f('columns')}>
            <div className={f('callout-box', 'pp-browse-by')}>
              <Tabs>
                <div
                  title="Member Database"
                  data-testid="home-member-database-button"
                >
                  <ByMemberDatabase />
                </div>
                <div title="Entry type" data-testid="home-entry-type-button">
                  <ByEntryType />
                </div>
                <div title="Species" data-testid="home-species-button">
                  <BySpecies />
                </div>
              </Tabs>
            </div>
          </div>

          <div className={f('columns')}>
            {
              // Browse by latest entries or most popular
            }
            <div className={f('callout-box')}>
              <Tabs>
                <div title="Latest entries">
                  <ByLatestEntries />
                </div>
                <div title="Favourite entries">
                  <FavouriteEntries />
                </div>
                <div title="Recent Search">
                  <SearchTerms />
                </div>
              </Tabs>
            </div>
            {
              // end callout
            }
          </div>
          {
            // end entry-list
          }
        </div>
        {
          // end Browse entry & entry list
        }

        {
          // begin blog & protein focus
        }
        <div className={f('row', 'columns')}>
          <h3 className={f('light')}>In the spotlight</h3>
          <BlogEntries />
        </div>
        {
          // end blog & protein focus
        }

        {
          // begin tools
        }
        <div className={f('row', 'columns')}>
          <h3 className={f('light')}>Tools &amp; libraries</h3>
        </div>

        <ToolCards />

        <ErrorBoundary>
          <Twitter />
        </ErrorBoundary>
        <div className={f('row')}>
          <span className={f('elixir-title')}>This service funded by</span>
          <img src={embl} className={f('image-funding')} alt="EMBL logo" />
          <img
            src={wellcome}
            className={f('image-funding')}
            alt="Wellcome Trust logo"
          />
          <img src={bbsrc} className={f('image-funding')} alt="BBSRC logo" />
        </div>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.notifications.showSettingsToast,
  (state) => state.settings.notifications.showHelpToast,
  (showSettingsToast, showHelpToast) => ({ showSettingsToast, showHelpToast }),
);

export default connect(mapStateToProps)(Home);
