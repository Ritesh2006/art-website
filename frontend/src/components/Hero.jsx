import React from 'react';
import { motion } from 'framer-motion';
import { artworkSVG } from '../utils/svg';

const Hero = ({ scrollTo }) => {
  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <div className="hero-eyebrow">Art With Ritesh — Bishnupur</div>
        <h1 className="hero-title">
          The Art of<br/>
          <em>Seeing Deeply</em>
        </h1>
        <p className="hero-subtitle">
          Original artworks by Ritesh Rakshit — charcoal portraits, oil landscapes, pencil studies, acrylic compositions, and extraordinary acrylic fiber portraits from Kolkata, India.
        </p>
        <div className="hero-ctas">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="btn-primary" 
            onClick={() => scrollTo('gallery')}
          >
            Explore Gallery
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            className="btn-outline" 
            onClick={() => scrollTo('contact')}
          >
            Commission a Piece
          </motion.button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">12+</div>
            <div className="stat-label">Years</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">200+</div>
            <div className="stat-label">Collectors</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">28</div>
            <div className="stat-label">Exhibitions</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5</div>
            <div className="stat-label">Mediums</div>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-art-grid">
           <div className="art-cell art-cell-0">
             <div dangerouslySetInnerHTML={{ __html: artworkSVG({id: "cha-001", category: "charcoal", title: "Whispers of the Soul"}) }} style={{width: '100%', height: '100%'}}/>
           </div>
           <div className="art-cell">
             <div dangerouslySetInnerHTML={{ __html: artworkSVG({id: "oil-001", category: "oil-painting", title: "Crimson Dusk"}) }} style={{width: '100%', height: '100%'}}/>
           </div>
           <div className="art-cell">
             <div dangerouslySetInnerHTML={{ __html: artworkSVG({id: "afp-001", category: "acrylic-fiber-portrait", title: "Bride in Crimson"}) }} style={{width: '100%', height: '100%'}}/>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
