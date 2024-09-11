import { PureComponent } from 'react';

type Props<Payload = unknown> = {
  taxID?: string;
  sendData: (taxID: string, payload: Payload) => void;
};
export interface DataProviderLoadedProps<Payload = unknown>
  extends Props<Payload>,
    LoadDataProps<Payload> {}

class DataProvider<Payload = unknown> extends PureComponent<
  DataProviderLoadedProps<Payload>
> {
  _sent: boolean = false;

  componentDidMount() {
    this._sendDataUpIfAny();
  }

  componentDidUpdate({ data }: DataProviderLoadedProps<Payload>) {
    if (this.props.data?.payload !== data?.payload) this._sendDataUpIfAny();
  }

  _sendDataUpIfAny = () => {
    if (this._sent) return;
    const { taxID, data, sendData } = this.props;
    if (!taxID) return;
    const { loading, payload } = data || {};
    if (!loading && payload) {
      this._sent = true;
      sendData(taxID, payload);
    }
  };

  render() {
    return null;
  }
}

export default DataProvider;
