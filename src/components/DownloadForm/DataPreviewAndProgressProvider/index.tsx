import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

type ChildrenFnProps = {
  data?: RequestedData<PayloadList<unknown>>;
  download?: DownloadProgress;
  isStale?: boolean;
};

type Props = {
  url: string;
  fileType: string;
  subset: boolean;
  download?: DownloadProgress;
  children: ({ data, download, isStale }: ChildrenFnProps) => React.ReactNode;
  [otherProp: string]: unknown;
};

interface LoadedProps extends Props, LoadDataProps<PayloadList<unknown>> {}

export const DataPreviewProviderWithoutData = ({
  children,
  data,
  download,
  isStale,
}: LoadedProps) => {
  return children({ data, download, isStale });
};

const getMapStateToProps = () =>
  createSelector(
    (state: GlobalState) => state.download,
    (_: GlobalState, { url, fileType, subset }: Props) => ({
      url,
      fileType,
      subset,
    }),
    (downloads, { url, fileType, subset }) => ({
      download:
        downloads[
          [url, fileType, subset && 'subset'].filter(Boolean).join('|')
        ] || {},
    }),
  );

export default loadData({
  getUrl: (_, { url }) => url,
  mapStateToProps: getMapStateToProps(),
} as Params)(DataPreviewProviderWithoutData);
