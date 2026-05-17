function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 min-w-[100px] bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
      <div className="w-11 h-11 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px] text-neutral-400 font-bold font-cairo">{label}</span>
        <span className="text-sm font-black text-neutral-800 font-cairo text-center">{value}</span>
      </div>
    </div>
  );
}
export default DetailItem;