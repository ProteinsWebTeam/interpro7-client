import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';
import { DomainArchitecturesWithData } from 'components/Entry/DomainArchitectures/index';

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state => state.customLocation.search,
  (mainAccession, search) => ({ mainAccession, search }),
);

const getUrlForIDASearch = createSelector(
  state => state.settings.api,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, search) => {
    // omit from search
    const description = {
      main: { key: 'entry' },
    };
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: search,
    });
  },
);
export default loadData({
  getUrl: getUrlForIDASearch,
  mapStateToProps,
})(DomainArchitecturesWithData);
