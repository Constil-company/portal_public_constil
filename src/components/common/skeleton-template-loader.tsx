interface SkeletonLoaderProps {
    className?: string;
  }
  
  export const SkeletonTemplateLoader: React.FC<SkeletonLoaderProps> = ({ 
    className = "" 
  }) => {
    return (
      <div className={`w-full ${className}`}>
        {/* Grid com espaçamento reduzido (gap-2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex flex-col w-full animate-pulse">
              {/* Card do skeleton com altura fixa e largura automática */}
              <div className="h-[33rem] bg-gray-200 rounded-xl animate-pulse"></div>                           
            </div>
          ))}
        </div>
      </div>
    );
  };

