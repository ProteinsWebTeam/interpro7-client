import React from 'react';

type Fun = () => void;
export const useInterval = (callback: Fun, delay: number) => {
  const savedCallback = React.useRef<Fun>();
  const [id, setId] = React.useState<NodeJS.Timer | undefined>(undefined);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = ()=>{
    if (id){
    clearInterval(id);
    setId(undefined);
  }
  }
  // Set up the interval.
  React.useEffect(() => {
    const tick = () => savedCallback?.current?.();
    if (delay !== null) {
      setId( setInterval(tick, delay));
      return () => {clear()}
    }
  }, [delay]);
  return [clear];
};

export default useInterval;
