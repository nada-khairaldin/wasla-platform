import { Skeleton } from "../../../components/ui/Skeleton";

export const SearchLoadingState = () => (
  <div className="flex flex-col gap-4 w-full h-full pb-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex flex-col p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-2 w-1/4" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full ml-auto" />
        </div>
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex gap-1.5 mb-4">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    ))}
  </div>
);
