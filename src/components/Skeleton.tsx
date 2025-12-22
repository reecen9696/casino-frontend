interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-casino-border/30";

  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-casino-card border border-casino-border rounded-lg px-4 py-2 flex flex-col justify-center text-center min-h-[80px] space-y-1">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Skeleton variant="circular" className="w-5 h-5" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
      <Skeleton variant="text" className="w-12 h-6 mx-auto" />
    </div>
  );
}

export function BetRowSkeleton() {
  return (
    <tr className="border-b border-casino-border/30">
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-16 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-20 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-16 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-12 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-14 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-20 h-4" />
      </td>
      <td className="px-4 py-2">
        <Skeleton variant="text" className="w-24 h-4" />
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="bg-casino-card border border-casino-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-casino-background/50 border-b border-casino-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-12 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-16 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-14 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-10 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-12 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-18 h-3" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                <Skeleton variant="text" className="w-20 h-3" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-casino-border/30">
            {Array.from({ length: rows }, (_, i) => (
              <BetRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="border-t border-casino-border/30 px-6 py-3">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-32 h-4" />
          <div className="flex items-center space-x-2">
            <Skeleton variant="rectangular" className="w-20 h-8" />
            <Skeleton variant="text" className="w-16 h-4" />
            <Skeleton variant="rectangular" className="w-20 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
