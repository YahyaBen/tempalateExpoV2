import { useEffect, useRef } from 'react';

export function useNativeLifecycle(onAppear?: () => void, onDisappear?: () => void) {
  const onAppearRef = useRef(onAppear);
  const onDisappearRef = useRef(onDisappear);

  useEffect(() => {
    onAppearRef.current = onAppear;
    onDisappearRef.current = onDisappear;
  });

  useEffect(() => {
    onAppearRef.current?.();
    return () => onDisappearRef.current?.();
  }, []);
}
