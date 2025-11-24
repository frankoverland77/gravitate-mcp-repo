/**
 * Hook for managing horizontal scroll navigation in cards view
 */

import { useRef } from 'react';

export interface UseScrollControlsReturn {
  /** Ref to attach to the scrollable container */
  cardsScrollRef: React.RefObject<HTMLDivElement>;

  /** Scroll the cards left or right */
  scrollCards: (direction: 'left' | 'right') => void;
}

/**
 * Provides scroll control functionality for horizontal card navigation
 *
 * @param scrollAmount - Amount in pixels to scroll per action (default: 300)
 * @returns Object with scroll ref and scroll function
 */
export function useScrollControls(scrollAmount: number = 300): UseScrollControlsReturn {
  const cardsScrollRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll the cards container left or right
   */
  const scrollCards = (direction: 'left' | 'right') => {
    if (cardsScrollRef.current) {
      cardsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return {
    cardsScrollRef,
    scrollCards
  };
}
