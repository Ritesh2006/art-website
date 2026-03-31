import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PenTool, Droplets, Pencil, Palette, Layers, ShoppingBag } from 'lucide-react';
import { ArtworkSkeleton } from './Skeleton';

const CatIcons = {
  'charcoal': <PenTool size={32} strokeWidth={1.5} />,
  'oil-painting': <Droplets size={32} strokeWidth={1.5} />,
  'pencil-sketch': <Pencil size={32} strokeWidth={1.5} />,
  'acrylic-painting': <Palette size={32} strokeWidth={1.5} />,
  'acrylic-fiber-portrait': <Layers size={32} strokeWidth={1.5} />
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const ParallaxArtwork = ({ children, index }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 50 : -50, index % 2 === 0 ? -50 : 50]);
  
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

const Gallery = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  artworks, 
  isLoading, 
  setSelectedArtwork, 
  addToCart, 
  artworkSVG 
}) => {
  return (
    <>
      <motion.section 
        id="gallery"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        <motion.div className="section-header" variants={fadeInUp}>
          <div className="section-tag">Browse by Medium</div>
          <h2 className="section-title">Five Distinct<br/>Artistic Mediums</h2>
          <p className="section-subtitle">Each medium carries its own language, texture, and emotional weight. Explore the full breadth of Ritesh's practice.</p>
        </motion.div>
        <div className="categories-section">
          <motion.div className="categories-grid" variants={staggerContainer}>
            {categories.map(cat => (
              <motion.div 
                key={cat.id} 
                variants={fadeInUp} 
                whileHover={{ scale: 1.05, y: -5 }} 
                whileTap={{ scale: 0.98 }} 
                className={`cat-card ${activeCategory === cat.id ? 'active' : ''}`} 
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              >
                <div className="cat-icon">{CatIcons[cat.id]}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-desc">{cat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="artworks-section">
        <div className="filter-bar">
          <span className="filter-label">
            {activeCategory && categories.length > 0 ? categories.find(c => c.id === activeCategory)?.name : 'All Works'}
          </span>
          <span className="filter-count">{artworks.length} works</span>
        </div>
        
        <motion.div 
          className="artworks-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => <ArtworkSkeleton key={i} />)
          ) : (
            artworks.map((art, idx) => (
              <ParallaxArtwork key={art.id} index={idx}>
                <motion.div 
                  variants={fadeInUp} 
                  whileHover={{ scale: 1.03, y: -8 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="artwork-card" 
                  onClick={() => setSelectedArtwork(art)}
                >
                  <div className="artwork-image">
                    {art.image_url ? (
                      <img src={art.image_url} alt={art.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: artworkSVG(art) }} style={{width: '100%', height: '100%'}}/>
                    )}
                    {art.featured && <div className="artwork-badge">Featured</div>}
                    {!art.available && <div className="sold-badge">Sold</div>}
                  </div>
                  <div className="artwork-info">
                    <div className="artwork-medium">{art.medium}</div>
                    <div className="artwork-title">{art.title}</div>
                    <div className="artwork-size">{art.size} · {art.year}</div>
                    <div className="artwork-price-row">
                      <div>
                        <span className="artwork-price">₹{art.price?.toLocaleString('en-IN')}</span>
                        {art.original_price && <span className="artwork-original-price">₹{art.original_price?.toLocaleString('en-IN')}</span>}
                      </div>
                      <button className="btn-icon" onClick={(e) => { e.stopPropagation(); addToCart(art); }} title="Add to collection">
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </ParallaxArtwork>
            ))
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Gallery;
