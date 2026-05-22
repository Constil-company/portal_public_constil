interface SkeletonLoaderProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`w-full bg-gray-100 rounded-lg p-4 animate-pulse ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === 0 ? 'w-3/4 mb-4' : index === lines - 1 ? 'w-1/4' : 'w-1/2 mb-2'
          }`}
        />
      ))}
    </div>
  );
};
