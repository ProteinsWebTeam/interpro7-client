import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';

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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.download,
  (_: GlobalState, { url, fileType, subset }: Props) => {
    return {
      url,
      fileType,
      subset,
    };
  },
  (downloads, { url, fileType, subset }) => {
    return {
      download:
        downloads[
          [url, fileType, subset && 'subset'].filter(Boolean).join('|')
        ] || {},
    };
  },
);

export default loadData({
  getUrl: (_, { url }) => url,
  mapStateToProps,
} as LoadDataParameters)(DataPreviewProviderWithoutData);
