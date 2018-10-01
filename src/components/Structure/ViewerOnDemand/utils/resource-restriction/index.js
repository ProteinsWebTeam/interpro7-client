const LOW_BATTERY_LEVEL = 0.15;
const SMALL_SCREEN = 650;

export default async () => {
  // If not in a browser, no restriction
  if (!window.navigator) return false;
  // If slow connection, restriction!
  if (
    'connection' in navigator &&
    navigator.connection.effectiveType !== '4g'
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
