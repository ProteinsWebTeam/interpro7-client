import React, { FormEvent } from 'react';

import { format } from 'url';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { goToCustomLocation } from 'actions/creators';

import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import style from '../style.css';
const css = cssBinder(style);

type Props = {
  isoform?: string;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};

interface LoadedProps extends Props, LoadDataProps<PayloadList<string>> {}

const Selector = ({
  data,
  isoform = '',
  goToCustomLocation,
  customLocation,
}: LoadedProps) => {
  if (!data || data.loading || !data.payload) return <Loading />;
  const isoforms = data.payload.results;

  const onChange = (event: FormEvent) => {
    if (!customLocation) return;
    const newLocation: InterProLocation = {
      ...customLocation,
      search: {},
    };
    if ((event?.target as HTMLSelectElement)?.value) {
      newLocation.search.isoform = (event.target as HTMLSelectElement).value;
    }
    goToCustomLocation?.(newLocation);
  };
  return (
    <select
      onChange={onChange}
      value={isoform}
      className={css('vf-form__select')}
    >
      <option className={css('placeholder')} value="">
        Select an Isoform to display...
      </option>
      {isoforms.map((acc) => (
        <option value={acc} key={acc}>
          {acc}
          {acc.endsWith('-1') ? ' [canonical]' : ''}
        </option>
      ))}
    </select>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.customLocation.search,
  (customLocation, { isoform }) => ({ customLocation, isoform })
);

const getIsoformURL = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root }, { protein: { accession } }) => {
    const description = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        isoforms: '',
      },
    });
  }
);
export default loadData({
  getUrl: getIsoformURL,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as Params)(Selector);
