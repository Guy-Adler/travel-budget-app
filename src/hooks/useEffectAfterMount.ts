import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

const useEffectAfterMount = (
  cb: EffectCallback,
  dependencies: DependencyList | undefined
) => {
  const mounted = useRef(true);

  useEffect(() => {
    if (!mounted.current) {
      return cb();
    }
    mounted.current = false;

    return () => {};
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useEffectAfterMount;
