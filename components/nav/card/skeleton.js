export function SkeletonCard() {
  return (
    <div className="w-[300px] absolute left-2/4 -translate-x-2/4 h-auto cursor-pointer rounded-[30px] bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 p-3">
      <div className="flex items-center h-auto gap-3 animate-pulse">
        <div className="w-[52px] h-[52px] rounded-[20px] bg-black/10 dark:bg-white/10"></div>
        <div className="flex-1 flex flex-col space-y-1 overflow-hidden">
          <div className="h-4 bg-black/10 dark:bg-white/10 rounded-full w-3/4"></div>
          <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full w-1/2 mt-1"></div>
        </div>
      </div>
    </div>
  );
}
