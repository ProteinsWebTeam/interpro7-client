const LOW_BATTERY_LEVEL = 0.15;
const SMALL_SCREEN = 650;

// http://wicg.github.io/netinfo/#connection-types
type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'mixed'
  | 'none'
  | 'other'
  | 'unknown'
  | 'wifi'
  | 'wimax';

// http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
type EffectiveConnectionType = '2g' | '3g' | '4g' | 'slow-2g';

// http://wicg.github.io/netinfo/#dom-megabit
type Megabit = number;
// http://wicg.github.io/netinfo/#dom-millisecond
type Millisecond = number;

// http://wicg.github.io/netinfo/#networkinformation-interface
interface NetworkInformation extends EventTarget {
  // http://wicg.github.io/netinfo/#type-attribute
  readonly type?: ConnectionType;
  // http://wicg.github.io/netinfo/#effectivetype-attribute
  readonly effectiveType?: EffectiveConnectionType;
  // http://wicg.github.io/netinfo/#downlinkmax-attribute
  readonly downlinkMax?: Megabit;
  // http://wicg.github.io/netinfo/#downlink-attribute
  readonly downlink?: Megabit;
  // http://wicg.github.io/netinfo/#rtt-attribute
  readonly rtt?: Millisecond;
  // http://wicg.github.io/netinfo/#savedata-attribute
  readonly saveData?: boolean;
  // http://wicg.github.io/netinfo/#handling-changes-to-the-underlying-connection
  onchange?: EventListener;
}

export default async () => {
  // If not in a browser, no restriction
  if (!window.navigator) return false;
  // If slow connection, restriction!
  if (
    'connection' in navigator &&
    (navigator.connection as NetworkInformation)?.effectiveType !== '4g'
  ) {
    return true;
  }
  // If small screen, restriction!
  if (window.innerWidth < SMALL_SCREEN) return true;
  try {
    if (
      'getBattery' in navigator &&
      typeof navigator.getBattery === 'function'
    ) {
      const battery = await navigator.getBattery();
      // If low battery and discharging, restriction!
      return !battery.isCharging && battery.level < LOW_BATTERY_LEVEL;
    }
  } catch {
    /**/
  }
  return false;
};
