import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    text: 'Ritesh captured my mother\'s portrait in charcoal with such depth and emotion. Every line tells a story. The piece now hangs in our living room and every guest stops to admire it.',
    artwork: 'Custom Charcoal Portrait',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'Bangalore, Karnataka',
    rating: 5,
    text: 'The oil painting I commissioned exceeded every expectation. The golden hour landscape feels alive — the light literally glows off the canvas. Truly museum-quality work.',
    artwork: 'Golden Hour Landscape',
    avatar: 'AM',
  },
  {
    id: 3,
    name: 'Sneha Bose',
    location: 'Kolkata, West Bengal',
    rating: 5,
    text: 'I ordered the acrylic fiber portrait as a wedding gift. The couple was moved to tears. The texture and depth of the mixed media is something you have to see in person to believe.',
    artwork: 'Acrylic Fiber Portrait',
    avatar: 'SB',
  },
  {
    id: 4,
    name: 'Rahul Verma',
    location: 'Delhi, NCR',
    rating: 5,
    text: 'Ritesh\'s pencil sketches have an almost photographic precision, yet they carry a warmth that no photograph can replicate. The commission process was smooth and professional.',
    artwork: 'Graphite Portrait',
    avatar: 'RV',
  },
  {
    id: 5,
    name: 'Ananya Iyer',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    text: 'Bought the Neon Garden acrylic piece online and was blown away when it arrived. The colours are even more vibrant in person. Packaging was immaculate — arrived in perfect condition.',
    artwork: 'Neon Garden',
    avatar: 'AI',
  },
  {
    id: 6,
    name: 'Vikram Nair',
    location: 'Pune, Maharashtra',
    rating: 5,
    text: 'Three pieces in my collection now, each one better than the last. Ritesh has a rare gift — he understands what you want before you can even articulate it. A true artist.',
    artwork: 'Multiple Commissions',
    avatar: 'VN',
  },
];

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? 'var(--gold)' : 'none'}
        color={i < rating ? 'var(--gold)' : 'var(--fog)'}
      />
    ))}
  </div>
);

const Avatar = ({ initials }) => (
  <div style={{
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--gold), var(--sienna))',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--ivory)', fontWeight: 600, fontSize: '0.85rem',
    fontFamily: "'Josefin Sans', sans-serif", flexShrink: 0,
    letterSpacing: '0.05em',
  }}>
    {initials}
  </div>
);

// Floating marquee row
const MarqueeRow = ({ items, direction = 1, speed = 30 }) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{ display: 'flex', gap: '1.5rem', width: 'max-content' }}
        animate={{ x: direction > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((review, i) => (
          <div key={i} style={{
            background: 'var(--ivory)',
            borderTop: '3px solid var(--gold)',
            padding: '1.8rem 2rem',
            width: '340px', flexShrink: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <StarRating rating={review.rating} />
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1rem', lineHeight: 1.8,
              color: 'var(--slate)', fontStyle: 'italic',
              marginBottom: '1.2rem',
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              "{review.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Avatar initials={review.avatar} />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>{review.name}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--fog)', marginTop: '2px' }}>{review.location}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Featured card with full text
const FeaturedCard = ({ review, isActive }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: -20 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{
      background: 'var(--ink)',
      padding: 'clamp(2rem, 5vw, 3.5rem)',
      position: 'relative', overflow: 'hidden',
      maxWidth: '700px', margin: '0 auto',
    }}
  >
    {/* decorative quote */}
    <div style={{
      position: 'absolute', top: '1.5rem', right: '2rem',
      opacity: 0.06, pointerEvents: 'none',
    }}>
      <Quote size={120} color="var(--gold)" />
    </div>

    <StarRating rating={review.rating} />

    <p style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      lineHeight: 1.85, color: 'var(--ivory)',
      fontStyle: 'italic', marginBottom: '2rem',
      position: 'relative', zIndex: 1,
    }}>
      "{review.text}"
    </p>

    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar initials={review.avatar} />
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--ivory)' }}>{review.name}</div>
        <div style={{ fontSize: '0.65rem', color: 'rgba(245,240,232,0.5)', marginTop: '3px' }}>{review.location}</div>
      </div>
      <div style={{
        marginLeft: 'auto',
        background: 'rgba(201,168,76,0.12)',
        border: '1px solid rgba(201,168,76,0.3)',
        padding: '0.3rem 0.9rem',
        fontSize: '0.6rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--gold)',
      }}>
        {review.artwork}
      </div>
    </div>
  </motion.div>
);

export default function Reviews() {
  const [activeIdx, setActiveIdx] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const prev = () => setActiveIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setActiveIdx(i => (i + 1) % REVIEWS.length);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section id="reviews" ref={ref} style={{ background: 'var(--canvas)', overflow: 'hidden', paddingBottom: '5rem' }}>

      {/* Header */}
      <motion.div
        className="section-header"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-tag" variants={itemVariants}>Collector Stories</motion.div>
        <motion.h2 className="section-title" variants={itemVariants}>
          What Collectors Say
        </motion.h2>
        <motion.p className="section-subtitle" variants={itemVariants}>
          Every piece finds its home. Here's what those homes have to say.
        </motion.p>
      </motion.div>

      {/* Featured spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ padding: '0 clamp(1rem, 5vw, 4rem)', marginBottom: '3rem' }}
      >
        <AnimatePresence mode="wait">
          <FeaturedCard key={activeIdx} review={REVIEWS[activeIdx]} />
        </AnimatePresence>

        {/* Controls */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', marginTop: '1.5rem',
        }}>
          <button onClick={prev} style={{
            background: 'none', border: '1px solid var(--fog)',
            width: '40px', height: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--ivory)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink)'; }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                width: i === activeIdx ? '24px' : '8px',
                height: '8px', borderRadius: '4px',
                background: i === activeIdx ? 'var(--gold)' : 'var(--fog)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease', padding: 0,
              }} />
            ))}
          </div>

          <button onClick={next} style={{
            background: 'none', border: '1px solid var(--fog)',
            width: '40px', height: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--ink)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink)'; e.currentTarget.style.color = 'var(--ivory)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink)'; }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
      >
        <MarqueeRow items={REVIEWS.slice(0, 4)} direction={1} speed={35} />
        <MarqueeRow items={REVIEWS.slice(2)} direction={-1} speed={28} />
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.7 }}
        style={{
          display: 'flex', justifyContent: 'center',
          gap: 'clamp(2rem, 8vw, 6rem)',
          flexWrap: 'wrap',
          marginTop: '3.5rem',
          padding: '2.5rem clamp(1rem, 5vw, 4rem)',
          borderTop: '1px solid var(--cream)',
        }}
      >
        {[
          { num: '100%', label: 'Satisfaction Rate' },
          { num: '200+', label: 'Happy Collectors' },
          { num: '5.0', label: 'Average Rating' },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 300, color: 'var(--ink)',
            }}>{num}</div>
            <div style={{
              fontSize: '0.62rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--fog)',
              marginTop: '4px',
            }}>{label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
