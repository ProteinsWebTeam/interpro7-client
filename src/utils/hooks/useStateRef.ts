import React from 'react';

export function useStateRef<T>(
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>, React.MutableRefObject<T>] {
  const [value, setValue] = React.useState(initialValue);

  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref];
}

export default useStateRef;
