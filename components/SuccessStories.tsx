'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export interface SuccessStory {
  id?: number | string;
  client_name: string;
  avatar_url?: string | null;
  rating?: number | string;
  content: string;
}

interface SuccessStoriesProps {
  stories: SuccessStory[];
}

export default function SuccessStories({ stories }: SuccessStoriesProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);

  // Responsive slide count calculation
  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const total = stories.length;
  const isSlider = total > 3;

  // Clones needed at beginning and end for seamless infinite loop
  const cloneCount = Math.min(visibleCount, total || 1);

  // Start displayIndex at cloneCount (corresponds to real story index 0)
  const [displayIndex, setDisplayIndex] = useState(cloneCount);

  // Adjust displayIndex when visibleCount / cloneCount changes
  useEffect(() => {
    setDisplayIndex((prev) => {
      if (total === 0) return 0;
      const realIdx = ((prev - cloneCount) % total + total) % total;
      return cloneCount + realIdx;
    });
  }, [cloneCount, total]);

  const isTransitioningRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Build extended array with prepended and appended clones
  const extendedStories = useMemo(() => {
    if (!isSlider || total === 0) return stories;
    const beforeClones = stories.slice(-cloneCount);
    const afterClones = stories.slice(0, cloneCount);
    return [...beforeClones, ...stories, ...afterClones];
  }, [stories, isSlider, total, cloneCount]);

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setWithTransition(true);
    setDisplayIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setWithTransition(true);
    setDisplayIndex((prev) => prev - 1);
  }, []);

  // When smooth transition ends, seamlessly snap bounds without transition
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (!isSlider || total === 0) return;

    if (displayIndex >= cloneCount + total) {
      // Reached after the real items: snap instantly to first real item
      setWithTransition(false);
      setDisplayIndex(cloneCount);
    } else if (displayIndex < cloneCount) {
      // Reached before the real items: snap instantly to corresponding end item
      setWithTransition(false);
      setDisplayIndex(displayIndex + total);
    }
  };

  // Autoplay functionality with smooth continuous forward loop
  useEffect(() => {
    if (!isSlider || isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isSlider, isPaused, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Current real active index for pagination dots (0 to total - 1)
  const currentRealIndex = total > 0 ? ((displayIndex - cloneCount) % total + total) % total : 0;

  const goToSlide = (targetRealIdx: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setWithTransition(true);
    setDisplayIndex(cloneCount + targetRealIdx);
  };

  const renderCard = (story: SuccessStory, keyPrefix: string, idx: number) => {
    const ratingCount = Math.min(5, Math.max(1, Number(story.rating) || 5));
    const initial = (story.client_name || 'C').trim().charAt(0).toUpperCase() || 'C';

    return (
      <div
        key={`${keyPrefix}-${story.id || idx}`}
        className="testimonial-card flex flex-col h-full bg-white select-none transition-all duration-300"
      >
        {/* Star Rating */}
        <div className="flex gap-1 mb-4 text-[#FFB347]">
          {Array.from({ length: ratingCount }).map((_, i) => (
            <svg
              key={`star-filled-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          {Array.from({ length: 5 - ratingCount }).map((_, i) => (
            <svg
              key={`star-empty-${i}`}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>

        {/* Content */}
        <p className="text-gray-600 text-[15px] italic mb-6 leading-relaxed flex-1">
          &ldquo;{story.content}&rdquo;
        </p>

        {/* Client details */}
        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-100">
          {story.avatar_url ? (
            <img
              src={story.avatar_url.startsWith('/') || story.avatar_url.startsWith('http') ? story.avatar_url : `/${story.avatar_url}`}
              alt={story.client_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-black/15 shadow-sm flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#af0202] text-white flex items-center justify-center font-nunito-bold text-sm shadow-sm flex-shrink-0">
              {initial}
            </div>
          )}
          <div>
            <h4 className="text-gray-900 font-nunito-bold text-sm leading-tight">{story.client_name}</h4>
            <span className="text-gray-500 text-xs">Verified Customer</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="reviews" className="w-full max-w-6xl mx-auto mb-24 mt-16 px-4 md:px-6 scroll-reveal">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="text-center sm:text-left">
          <p className="commerce-kicker text-[#af0202]">What our clients say</p>
          <h2 className="font-nunito-black text-2xl sm:text-4xl md:text-5xl text-gray-900">Success Stories</h2>
        </div>

        {/* Previous / Next Controls only shown if more than 3 reviews */}
        {isSlider && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous review"
              className="w-11 h-11 rounded-full border-2 border-black bg-white text-black shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition-all flex items-center justify-center cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next review"
              className="w-11 h-11 rounded-full border-2 border-black bg-white text-black shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition-all flex items-center justify-center cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* If 3 or fewer reviews: Render static clean grid */}
      {!isSlider ? (
        <div
          className={`grid grid-cols-1 ${
            total === 1
              ? 'max-w-md mx-auto'
              : total === 2
              ? 'md:grid-cols-2 max-w-3xl mx-auto'
              : 'md:grid-cols-3'
          } gap-8`}
        >
          {stories.map((story, i) => renderCard(story, 'grid', i))}
        </div>
      ) : (
        /* If more than 3 reviews: Render seamless infinite-loop slider */
        <div
          className="relative w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="overflow-hidden py-3 -my-3 px-1 -mx-1"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(-${displayIndex * (100 / visibleCount)}%)`,
                transition: withTransition
                  ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
                  : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedStories.map((story, idx) => (
                <div
                  key={`ext-${idx}`}
                  className="px-3 flex-shrink-0"
                  style={{
                    width: `${100 / visibleCount}%`,
                  }}
                >
                  <div className="h-full pb-3 pr-1">
                    {renderCard(story, `slide-${idx}`, idx)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neo-brutalist Pagination Bullets */}
          <div className="testimonials-swiper flex justify-center items-center mt-8 gap-1">
            {stories.map((_, idx) => (
              <button
                key={`bullet-${idx}`}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`swiper-pagination-bullet ${
                  currentRealIndex === idx ? 'swiper-pagination-bullet-active' : ''
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
