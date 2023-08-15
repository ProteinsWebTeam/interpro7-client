import React, { } from "react";
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Loading from 'components/SimpleCommonComponents/Loading';

import RelatedTable from '../RelatedTable';
// Disabling these viewers. It has been mentioned before they are redundant. 
// especially now displaying multiple chains in the table
// import EntriesOnStructure from '../DomainEntriesOnStructure';
// import StructureOnProtein from '../DomainStructureOnProtein';

import { findIn, filterIn } from "utils/processDescription/filterFuncions";

import classNames from 'classnames';

type Props = {
  mainData: Metadata,
  secondaryData: Array<MetadataWithLocations>,
  isStale: boolean,
  mainType: Endpoint,
  actualSize: number,
  otherFilters?: Array<unknown>,
  dataBase: RequestedData<RootAPIPayload>,
  secondaryDataLoading: boolean,
  focusType: Endpoint,
  focusDb?: string,
  nextAPICall?: string | null;
  previousAPICall?: string | null;
  currentAPICall?: string | null;
  status?: number | null;

};

const RelatedAdvanced = ({
  mainData,
  secondaryData,
  isStale,
  mainType,
  focusType,
  actualSize,
  otherFilters,
  dataBase,
  secondaryDataLoading,
  ...otherProps
}: Props) => {
  return (
    <div className={classNames('vf-stack', 'vf-stack--200')}>
      {secondaryDataLoading ? (
        <Loading />
      ) : (
        <div>
          {/* {mainType === 'protein' && focusType === 'structure' ? (
            <StructureOnProtein
              structures={secondaryData}
              protein={mainData}
            />
          ) : null} */}
          {/* {mainType === 'structure' && focusType === 'entry' ? (
            <EntriesOnStructure entries={secondaryData as StructureLinkedObject[]} structure={mainData.accession} />
          ) : null} */}
          <RelatedTable
            mainType={mainType}
            mainData={mainData}
            secondaryData={secondaryData}
            focusType={focusType}
            otherFilters={otherFilters}
            dataBase={dataBase}
            isStale={isStale}
            actualSize={actualSize}
            otherProps={{ ...otherProps }}
          />
        </div>
      )}
    </div>
  );
}


const mapStateToPropsAdvanced = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key as Endpoint,
  (state: GlobalState) =>
    findIn(
      state.customLocation.description,
      (value: EndpointPartialLocation) =>
        !!value.isFilter && value.order === 1,
    ),
  (state: GlobalState) =>
    filterIn(
      state.customLocation.description,
      (value: EndpointPartialLocation) =>
        !!value.isFilter && value.order !== 1,
    ),
  (mainType, [focusType, focusObj], otherFilters) => ({
    mainType,
    focusType: focusType as Endpoint,
    focusDB: (focusObj as EndpointLocation)?.db,
    otherFilters,
  }),
);
export default connect(mapStateToPropsAdvanced)(RelatedAdvanced);
