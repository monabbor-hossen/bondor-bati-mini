import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export function PlusIcon({ className = 'w-4 h-4', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function MinusIcon({ className = 'w-4 h-4', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-5 h-5', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 20}
      height={size || 20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function DotSeparator({ className = 'w-1.5 h-1.5 mx-4 text-white/40 fill-current' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 6 6" aria-hidden="true">
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function FoodPlateIcon({ className = 'w-12 h-12', size, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 48}
      height={size || 48}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Covered serving dish / cloche */}
      <path d="M12 4v2" />
      <path d="M4 18h16" />
      <path d="M20 18a8 8 0 0 0-16 0" />
      <path d="M3 20h18" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * NoticeIcon: Renders clean SVG vectors for marquee announcements and notice badges.
 * Supports both named identifiers ('clock', 'truck', 'food', etc.) and emoji fallbacks.
 */
export function NoticeIcon({
  name,
  className = 'w-4 h-4',
  size,
  ...props
}: {
  name?: string;
  className?: string;
  size?: number | string;
} & React.SVGProps<SVGSVGElement>) {
  const key = (name || '').trim().toLowerCase();

  // Clock / Time
  if (key === 'clock' || key === 'time' || key === '⏰' || key === '⏱️') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  // Delivery / Truck
  if (key === 'truck' || key === 'delivery' || key === '🚚' || key === '🛵') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    );
  }

  // Food / Bento / Meal
  if (
    key === 'food' ||
    key === 'bento' ||
    key === 'meal' ||
    key === 'cuisine' ||
    key === '🍱' ||
    key === '🍛' ||
    key === '🍲' ||
    key === '🍗' ||
    key === '🐟'
  ) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
        <line x1="15" y1="2" x2="15" y2="22" />
        <line x1="9" y1="2" x2="9" y2="7" />
        <path d="M9 7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2" />
        <path d="M6 2v20" />
      </svg>
    );
  }

  // Fire / Hot Deal / Special
  if (key === 'fire' || key === 'flame' || key === 'hot' || key === '🔥') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    );
  }

  // Lightning / Flash / Fast
  if (key === 'bolt' || key === 'zap' || key === 'lightning' || key === 'flash' || key === '⚡') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }

  // Celebration / Party / Event
  if (key === 'party' || key === 'event' || key === 'celebration' || key === '🎉') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="m4 15 11-11 5 5-11 11-5-5Z" />
        <path d="m2 22 5-5" />
        <path d="M14 4 9 9" />
        <path d="m18 8 2 2" />
        <circle cx="17" cy="17" r="1" fill="currentColor" />
        <circle cx="7" cy="7" r="1" fill="currentColor" />
      </svg>
    );
  }

  // Star / Featured / Rating
  if (key === 'star' || key === 'featured' || key === '⭐' || key === '✨') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || 16}
        height={size || 16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  // Default: Megaphone / Announcement
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 16}
      height={size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
