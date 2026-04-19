import type { Feature } from '../../../../types';

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="flex flex-col gap-sm py-xl2 px-xl rounded-2xl bg-primary-500 shadow-[0_4px_10px_-3px_rgba(0,0,0,0.2)] hover:bg-primary-600/90 transition-colors duration-200 group
      w-[calc(100vw-100px)] md:w-full flex-shrink-0 snap-center">

      <div className="w-xl3 h-xl3 rounded-xl flex items-center justify-center text-secondary-500 group-hover:bg-white/10 transition-colors">
        {feature.icon}
      </div>

      <div className="flex flex-col gap-sm">
        <h5 className="font-semibold text-h6 text-neutral-50 break-words">
          {feature.title}
        </h5>
        <p className="text-body-4 text-neutral-50 leading-relaxed whitespace-normal break-words">
          {feature.description}
        </p>
      </div>
    </div>
  );
}
export default FeatureCard
