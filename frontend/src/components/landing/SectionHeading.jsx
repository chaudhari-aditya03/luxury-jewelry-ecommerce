import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col gap-4 ${alignClass}`}
    >
      {eyebrow ? (
        <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl md:text-5xl font-semibold text-luxury leading-tight max-w-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-sm md:text-lg text-muted leading-7">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
};

export default SectionHeading;