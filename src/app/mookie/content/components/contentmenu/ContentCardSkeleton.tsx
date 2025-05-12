"use client";

const ContentCardSkeleton = () => {
  return (
    <div className="w-[200px] border-1 border-gray-200 rounded p-1 bg-white shadow flex flex-col gap-1">
      {/* Badges Placeholder */}
      <div className="flex justify-end gap-1 h-[22px]">
        <div className="h-full w-10 rounded bg-gray-200 animate-pulse"></div>
        <div className="h-full w-10 rounded bg-gray-200 animate-pulse"></div>
      </div>
      {/* Icon Placeholder */}
      <div className="flex flex-row justify-center h-[80px] items-center">
        <div className="w-[72px] h-[72px] rounded bg-gray-200 animate-pulse"></div>
      </div>
      {/* Title Placeholder */}
      <div className="h-6 w-3/4 mx-auto rounded bg-gray-200 animate-pulse"></div>
      {/* Date Placeholder */}
      <div className="h-4 w-1/2 mx-auto rounded bg-gray-200 animate-pulse mt-1"></div>
      {/* Action Buttons Placeholder */}
      <div className="flex gap-3 justify-center p-2 mt-1">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ContentCardSkeleton;
