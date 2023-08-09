import React, { } from "react";
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { findIn } from "utils/processDescription/filterFuncions";

import ObjectToList from '../ObjectToList';
import classNames from 'classnames';

type Props = {
  secondaryData: Record<string, unknown>,
  mainType?: string,
  focusType?: string,
};

const RelatedSimple = ({ secondaryData, mainType, focusType }: Props) => {

  return (
    <div className={classNames('vf-stack', 'vf-stack--200')}>
      <p>This {mainType} is related to this:</p>
      <ObjectToList
        obj={secondaryData}
        component={({ k: db, value }) => (
          <Link
            to={(customLocation) => ({
              ...customLocation,
              description: {
                main: { key: focusType },
                [focusType || '']: { db },
              },
            })}
          >
            {db}: {value}
          </Link>
        )}
      />
    </div>
  );
}


const mapStateToPropsSimple = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) =>
    findIn(
      state.customLocation.description,
      (value: EndpointPartialLocation) => !!value.isFilter,
    )?.[0] || '',
  (mainType, focusType) => ({ mainType, focusType }),
);
export default connect(mapStateToPropsSimple)(RelatedSimple);