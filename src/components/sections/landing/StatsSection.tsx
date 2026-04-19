"use client";
import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion, Variants } from "framer-motion";

const Counter = ({ value }: { value: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue.toLocaleString()}+</span>;
};

const stats = [
  { id: 1, label: "مستخدم نشط", value: 25000 },
  { id: 2, label: "ساعة تبادل", value: 5000 },
  { id: 3, label: "تقييم للمنصة", value: 3000 },
];

function StatsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } 
    }
  };

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-primary-500 py-20 px-6 mt-12 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
          {stats.map((item, index) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={`relative group flex justify-center items-center w-full 
                ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="relative p-xl2 md:p-xl3 border border-white/20 w-full max-w-[250px] max-h-[145px] aspect-square flex flex-col items-center justify-center transition-all duration-300 group-hover:border-yellow-500/50">
                
            
                <motion.div 
                  initial={{ x: 10, y: -10 }}
                  whileInView={{ x: 0, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="absolute -top-0.5 -right-0.5 w-xl2 h-xl2 border-t-4 border-r-4 border-yellow-500"
                ></motion.div>

                {/* bottom left corner */}
                <motion.div 
                  initial={{ x: -10, y: 10 }}
                  whileInView={{ x: 0, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="absolute -bottom-[2px] -left-[2px] w-xl2 h-xl2 border-b-4 border-l-4 border-yellow-500"
                ></motion.div>

                <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-4">
                  <Counter value={item.value} />
                </div>

                <p className="text-2xl font-medium text-neutral-50 text-center">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default StatsSection;