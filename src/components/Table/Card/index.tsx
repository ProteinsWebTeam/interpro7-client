import { CardRenderer } from '../views/Grid';

const Card = <RowData extends object>({
  children: _,
}: {
  children: CardRenderer<RowData>;
}) => null;

export default Card;
