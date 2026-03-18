import { browser } from '$app/environment';
import type { Action } from 'svelte/action';

export const backButton: Action<HTMLElement> = (node) => {
  const handleClick = () => {
    if (browser && window.history.length > 1) {
      window.history.back();
    } else {
      console.warn('No history found to go back.');
    }
  };

  node.addEventListener('click', handleClick);

  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    }
  };
};

export function goBack() {
  if (browser) {
    window.history.back();
  }
}