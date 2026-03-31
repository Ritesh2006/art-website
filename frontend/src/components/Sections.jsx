import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export const About = () => (
  <motion.section 
    className="about-section" 
    id="about"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={staggerContainer}
  >
    <motion.div variants={fadeInUp} className="about-art">
      <div style={{width:'100%', height:'100%', minHeight:'50vw', background:'transparent'}} />
    </motion.div>
    <motion.div variants={fadeInUp} className="about-content">
      <div className="about-eyebrow">The Artist</div>
      <h2 className="about-title">
        Art that breathes,<br/>
        <em>lives, and endures</em>
      </h2>
      <div className="about-divider"></div>
      <p className="about-body">Born and raised in Kolkata — the city of art, intellect, and culture — Ritesh Rakshit has spent over twelve years exploring the full spectrum of visual expression.</p>
      <div className="about-signature">Ritesh Rakshit</div>
    </motion.div>
  </motion.section>
);

export const Contact = ({ contactForm, setContactForm, submitContact }) => (
  <motion.section 
    className="contact-section" 
    id="contact"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={staggerContainer}
  >
    <motion.div variants={fadeInUp} className="contact-info">
      <div className="about-eyebrow" style={{color: 'rgba(245,240,232,0.6)'}}>Get in Touch</div>
      <h2 className="contact-title">Commission a<br/>Masterpiece</h2>
      <p className="contact-subtitle">Response within 24–48 hours.</p>
      <div className="contact-detail">
        <Phone className="contact-detail-icon" size={18} /> +91 98765 43210
      </div>
      <div className="contact-detail">
        <Mail className="contact-detail-icon" size={18} /> studio@riteshrakshit.art
      </div>
      <div className="contact-detail">
        <MapPin className="contact-detail-icon" size={18} /> North Kolkata, India
      </div>
    </motion.div>
    <motion.div variants={fadeInUp} className="contact-form">
      <h3 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 300, color: 'var(--ivory)', marginBottom: '2rem'}}>Send a Message</h3>
      <div className="form-group">
        <label className="form-label">Your Name</label>
        <input type="text" className="form-input" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} placeholder="Full name" />
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input type="email" className="form-input" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="email@example.com" />
      </div>
      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea className="form-textarea" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} placeholder="Tell Ritesh about your vision..."></textarea>
      </div>
      <button className="form-submit" onClick={submitContact}>Send Message</button>
    </motion.div>
  </motion.section>
);
