import { useEffect } from 'react';
import { IDLE_TIMEOUT } from '../config';

export function useIdleReset(onIdle: () => void, timeout = IDLE_TIMEOUT) {
  useEffect(() => {
    let timer = window.setTimeout(onIdle, timeout);

    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onIdle, timeout);
    };

    window.addEventListener('pointerdown', reset);
    window.addEventListener('keydown', reset);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [onIdle, timeout]);
}
