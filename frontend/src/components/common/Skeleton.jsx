import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    avatar: 'w-10 h-10 rounded-full',
    title: 'h-8 rounded',
    image: 'w-full h-48 rounded-lg',
    card: 'h-64 rounded-lg',
  };

  return (
    <div
      className={`${variants[variant]} ${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
    />
  );
};

export const SkeletonProduct = () => {
  return (
    <div className="card p-4 space-y-4">
      <Skeleton variant="image" />
      <Skeleton variant="title" className="h-6" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
};

export default Skeleton;
