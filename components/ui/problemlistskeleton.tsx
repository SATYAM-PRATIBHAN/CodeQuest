const ProblemListSkeleton = () => {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 bg-[#161B22] border border-[#30363D] rounded-lg shadow-md animate-pulse"
          >
            <div className="w-full">
              {/* Title Skeleton */}
              <div className="h-5 w-2/3 bg-gray-700 rounded-md mb-2"></div>
  
              {/* Platform Skeleton */}
              <div className="h-4 w-1/4 bg-gray-700 rounded-md mb-2"></div>
  
              {/* Tags Skeleton */}
              <div className="flex gap-2 mt-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-5 w-12 bg-gray-700 rounded-md"></div>
                ))}
              </div>
            </div>
  
            {/* Difficulty Skeleton */}
            <div className="h-5 w-16 bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProblemListSkeleton;
  