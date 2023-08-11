import React, { FormEvent, useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import LazyImage from 'components/LazyImage';

import loadable from 'higherOrder/loadable';

import isResourceRestricted from './utils/resource-restriction';
import { Props as ViewerProps } from '../Viewer';
import { changeSettingsRaw } from 'actions/creators';

import styles from './style.css';

const StructureViewAsync = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "structure-viewer" */ 'components/Structure/Viewer'
    ),
  loading: null,
});

type Props = {
  id: string;
  userActivatedVisible: boolean;
  changeSettingsRaw: typeof changeSettingsRaw;
} & ViewerProps;

export const ViewerOnDemand = (props: Props) => {
  const { id, userActivatedVisible, changeSettingsRaw } = props;
  const [visible, setVisible] = useState(userActivatedVisible);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const initializeVisible = async () => {
      setVisible(!(await isResourceRestricted()));
    };
    initializeVisible().catch(console.error);
  }, []);

  if (visible) {
    return <StructureViewAsync {...props} />;
  }

  const handleCheckboxClick = (e: FormEvent) => e.stopPropagation();

  const handleClick = () => {
    if (inputRef.current?.checked) {
      changeSettingsRaw('ui', 'structureViewer', true);
    }
    setVisible(true);
  };

  return (
    <div className={styles.wrapper}>
      <button className={styles['inner-wrapper']} onClick={handleClick}>
        <div className={styles.background}>
          <LazyImage
            src={`//www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/getimg.pl?source=pdbsum&pdb_code=${id}&file=traces.jpg`}
            alt={`structure with accession ${id}`}
          />
        </div>
        <div className={styles.text}>
          <p>
            click or tap this area to display the interactive structure viewer
          </p>
          <p>
            <label htmlFor="cb_reminder">
              Remember this next time?{' '}
              <input
                type="checkbox"
                ref={inputRef}
                id="cb_reminder"
                onClick={handleCheckboxClick}
              />
            </label>
            <small>
              This can be reversed in the{' '}
              <Link to={{ description: { other: ['settings'] } }}>
                Settings
              </Link>{' '}
              page
            </small>
          </p>
        </div>
      </button>
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui.structureViewer,
  (userActivatedVisible) => ({
    userActivatedVisible: userActivatedVisible || false,
  })
);

export default connect(mapStateToProps, { changeSettingsRaw }, null, {
  forwardRef: true,
})(ViewerOnDemand);
