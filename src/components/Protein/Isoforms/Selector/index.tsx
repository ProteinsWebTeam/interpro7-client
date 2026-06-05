import React, { FormEvent, useEffect } from 'react';

import { format } from 'url';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { goToCustomLocation } from 'actions/creators';

import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import style from '../style.css';
import _ from 'node_modules/@types/lodash';
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

  useEffect(() => {
    if (!customLocation) return;
    const newLocation: InterProLocation = {
      ...customLocation,
      search: {},
    };
    newLocation.search.isoform =
      customLocation.description.protein.accession + '-1';
    goToCustomLocation?.(newLocation);
  }, [isoforms]);

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
      {isoforms
        .sort((a: string, b: string) => {
          const i = Number.parseInt(a.split('-')[1]);
          const j = Number.parseInt(b.split('-')[1]);
          return i - j;
        })
        .map((acc) => (
          <option value={acc} key={acc}>
            {acc.endsWith('-1') ? acc + ' (Canonical)' : acc}
          </option>
        ))}
    </select>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.customLocation.search,
  (customLocation, { isoform }) => ({ customLocation, isoform }),
);

const getIsoformURL = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  ({ protocol, hostname, port, root }, { protein: { accession } }) => {
    const description: InterProPartialDescription = {
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
  },
);
export default loadData({
  getUrl: getIsoformURL,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(Selector);
