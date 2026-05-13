function Skeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-10 h-10 bg-neutral-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="w-20 h-3 bg-neutral-200 rounded"></div>
        <div className="w-16 h-2 bg-neutral-100 rounded"></div>
      </div>
    </div>
  );
}

export default Skeleton;
