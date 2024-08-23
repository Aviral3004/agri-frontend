import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = [
  "Machine Learning.",
  "Data Science.",
  "Deep Learning.",
  "Artificial Intelligence.",
];

const RotatingText = () => {
  const [index, setIndex] = useState(0);
  const [isReversing, setIsReversing] = useState(false);

  useEffect(() => {
    let interval;
    if (isReversing) {
      interval = setInterval(() => {
        setIndex((prevIndex) => {
          if (prevIndex === 0) {
            setIsReversing(false);
            return prevIndex;
          }
          return prevIndex - 1;
        });
      }, 300); // Faster reverse speed
    } else {
      interval = setInterval(() => {
        setIndex((prevIndex) => {
          if (prevIndex === words.length - 1) {
            setIsReversing(true);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 2000); // Normal forward animation speed
    }

    return () => clearInterval(interval);
  }, [isReversing]);

  return (
    <div className="h-16 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          className="text-red-500 text-5xl font-lato font-bold"
          key={words[index]}
          initial={{ opacity: 0, y: isReversing ? -60 : 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isReversing ? 60 : -60 }}
          transition={{
            duration: isReversing ? 0.3 : 1.5,
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {words[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
