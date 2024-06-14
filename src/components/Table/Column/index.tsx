import { PropsWithChildren, ReactNode } from 'react';

export type Renderer<
  CellData = unknown,
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = (cellData: CellData, rowData: RowData, extraData?: ExtraData) => ReactNode;

export type ColumnProps<
  CellData = unknown,
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
> = PropsWithChildren<{
  dataKey: string;
  defaultKey?: string;
  name?: string;
  renderer?: Renderer<CellData, RowData, ExtraData>;
  displayIf?: boolean;
  headerStyle?: React.CSSProperties;
  cellStyle?: React.CSSProperties;
  headerClassName?: string;
  cellClassName?: string;
  isSearchable?: boolean;
  isSortable?: boolean;
  showOptions?: boolean;
  options?: unknown;
  customiseSearch?: unknown;
}>;

const Column = <
  CellData = unknown,
  RowData = Record<string, unknown>,
  ExtraData = Record<string, unknown>,
  // eslint-disable-next-line no-empty-pattern
>({}: ColumnProps<CellData, RowData, ExtraData>) => null;

export default Column;
