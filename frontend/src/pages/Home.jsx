import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, X, Plus, User, ArrowRight, PenTool, Droplets, Pencil, Palette, Layers, Check, Phone, Mail, MapPin, ShoppingBag, Menu, LayoutDashboard } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validatePassword, validateRequired, validatePrice } from '../utils/formValidation';
import '../styles/index.css';
import { artworkSVG } from '../utils/svg';
import ThreeBackground from '../components/ThreeBackground';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import { About, Contact } from '../components/Sections';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-3o9b.onrender.com';

const CatIcons = {
  'charcoal': <PenTool size={32} strokeWidth={1.5} />,
  'oil-painting': <Droplets size={32} strokeWidth={1.5} />,
  'pencil-sketch': <Pencil size={32} strokeWidth={1.5} />,
  'acrylic-painting': <Palette size={32} strokeWidth={1.5} />,
  'acrylic-fiber-portrait': <Layers size={32} strokeWidth={1.5} />
};

export default function Home() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [settings, setSettings] = useState({ is_taking_orders: true });
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [toast, setToast] = useState('');

  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', email: '', address: '', city: '', pincode: '' });
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // User Auth & Newsletter State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [currentUser, setCurrentUser] = useState(null);

  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Navbar Dynamic State
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
    fetchArtworks();

    const savedUser = localStorage.getItem('art_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    // Auto-pop newsletter after 5 seconds
    const hasSeenNewsletter = localStorage.getItem('seen_newsletter');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setIsNewsletterOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE}/settings`);
      setSettings(res.data);
    } catch (e) { console.error('Error fetching settings:', e); }
  };

  useEffect(() => {
    fetchArtworks(activeCategory);
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      setCategories(res.data);
    } catch (e) { console.error('Error fetching categories:', e); }
  };

  const fetchArtworks = async (cat = null) => {
    setIsLoading(true);
    try {
      const url = cat ? `${API_BASE}/artworks?category=${cat}` : `${API_BASE}/artworks`;
      const res = await axios.get(url);
      setArtworks(res.data);
    } catch (e) { 
      console.error('Error fetching artworks:', e); 
      showToast('Could not load artworks. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const addToCart = (art) => {
    if (!settings.is_taking_orders) {
      showToast('We are currently not accepting new orders.');
      return;
    }
    if (!art.available) return;
    if (cart.find(i => i.id === art.id)) {
      showToast('Already in your collection');
      return;
    }
    setCart([...cart, art]);
    showToast(`"${art.title}" added to collection`);
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
  const totalCart = cart.reduce((s, i) => s + i.price, 0);

  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePin = (pin) => /^\d{6}$/.test(pin);

  const submitOrder = async () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.city || !checkoutForm.pincode) {
      showToast('Please fill all required fields');
      return;
    }
    if (!validateEmail(checkoutForm.email)) {
      showToast('Invalid email format');
      return;
    }
    if (!validatePhone(checkoutForm.phone)) {
      showToast('Phone number must be exactly 10 digits');
      return;
    }
    if (!validatePin(checkoutForm.pincode)) {
      showToast('PIN code must be exactly 6 digits');
      return;
    }
    try {
      const payload = {
        ...checkoutForm,
        items: cart.map(i => ({ artwork_id: i.id, quantity: 1 })),
        total: totalCart
      };
      const res = await axios.post(`${API_BASE}/orders`, payload);
      setCart([]);
      setIsCheckoutOpen(false);
      showToast(`Order #${res.data.order_id} confirmed!`);
    } catch (e) { showToast('Error placing order'); }
  };

  const submitContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Please fill all fields');
      return;
    }
    if (!validateEmail(contactForm.email)) {
      showToast('Invalid email format');
      return;
    }
    try {
      await axios.post(`${API_BASE}/contact`, contactForm);
      setContactForm({ name: '', email: '', message: '' });
      showToast('Message sent! Ritesh will respond within 48 hours.');
    } catch (e) { showToast('Error sending message'); }
  };

  // Auth Functions
  const submitAuth = async (e) => {
    e.preventDefault();
    if (!authForm.email || !authForm.password || (authMode === 'signup' && !authForm.name)) {
      showToast('Please fill all fields');
      return;
    }
    if (!validateEmail(authForm.email)) {
      showToast('Invalid email format');
      return;
    }
    if (!validatePassword(authForm.password)) {
      showToast('Password must be at least 6 characters');
      return;
    }
    try {
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await axios.post(`${API_BASE}${endpoint}`, authForm);
      const userObj = { id: res.data.user_id, name: res.data.name, email: authForm.email };
      setCurrentUser(userObj);
      localStorage.setItem('art_user', JSON.stringify(userObj));
      setIsAuthOpen(false);
      setAuthForm({name: '', email: '', password: ''});
      showToast(`Welcome ${res.data.name}!`);

      if (authMode === 'signup') {
          // Optionally prefill checkout email
          setCheckoutForm(prev => ({...prev, email: authForm.email, name: authForm.name}));
      }
    } catch (e) { 
      showToast(e.response?.data?.detail || 'Authentication failed'); 
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('art_user');
    showToast('Logged out');
  };

  // Newsletter Submit
  const submitNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    if (!validateEmail(newsletterEmail)) {
      showToast('Invalid email format');
      return;
    }
    try {
      await axios.post(`${API_BASE}/newsletter`, { email: newsletterEmail });
      localStorage.setItem('seen_newsletter', 'true');
      setIsNewsletterOpen(false);
      showToast('Thank you for subscribing!');
    } catch (e) { showToast('Error subscribing'); }
  };
  
  const closeNewsletter = () => {
    localStorage.setItem('seen_newsletter', 'true');
    setIsNewsletterOpen(false);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
    
    // Items on the left move up slightly, items on the right move down slightly
    const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 50 : -50, index % 2 === 0 ? -50 : 50]);
    
    return (
      <motion.div ref={ref} style={{ y }}>
        {children}
      </motion.div>
    );
  };

  return (
    <>
      <SEO />
      <ThreeBackground />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="scroll-progress-bar" 
        style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: '4px', background: 'var(--gold)', transformOrigin: '0%', zIndex: 1000 }} 
      />

      <nav id="navbar" className={isScrolled ? 'nav-scrolled' : ''}>
        <a className="nav-logo" onClick={() => { scrollTo('hero'); setIsMobileMenuOpen(false); }} style={{cursor:'pointer'}}>
          Ritesh <span>Rakshit</span>
        </a>
        
        {/* Desktop Nav */}
        <div className="nav-links">
          <a onClick={() => scrollTo('gallery')} className="nav-link">Gallery</a>
          <a onClick={() => scrollTo('about')} className="nav-link">Artist</a>
          <a onClick={() => scrollTo('reviews')} className="nav-link">Reviews</a>
          <a onClick={() => scrollTo('contact')} className="nav-link-cta">Contact</a>
        </div>

        <div className="nav-actions">
          <button className="nav-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </button>
          
          {currentUser ? (
            <button className="nav-btn" onClick={() => navigate('/dashboard')} title="My Dashboard">
              <LayoutDashboard size={20} className="text-gold" />
            </button>
          ) : (
            <button className="nav-btn" onClick={() => setIsAuthOpen(true)} title="Login">
              <User size={20} />
            </button>
          )}

          <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <a onClick={() => { scrollTo('gallery'); setIsMobileMenuOpen(false); }} className="mobile-nav-link">Gallery</a>
          <a onClick={() => { scrollTo('about'); setIsMobileMenuOpen(false); }} className="mobile-nav-link">Artist</a>
          <a onClick={() => { scrollTo('reviews'); setIsMobileMenuOpen(false); }} className="mobile-nav-link">Reviews</a>
          <a onClick={() => { scrollTo('contact'); setIsMobileMenuOpen(false); }} className="mobile-nav-link mobile-nav-cta">Contact</a>
        </div>
      </nav>

      <Hero scrollTo={scrollTo} />
      
      <Gallery 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        artworks={artworks}
        isLoading={isLoading}
        setSelectedArtwork={setSelectedArtwork}
        addToCart={addToCart}
        artworkSVG={artworkSVG}
      />

      <About />

      <Reviews />

      <Contact 
        contactForm={contactForm}
        setContactForm={setContactForm}
        submitContact={submitContact}
      />

      <footer>
        <div className="footer-bottom">
          <span className="footer-copy">© 2024 Ritesh Rakshit. All original artworks are protected intellectual property.</span>
          <span className="footer-copy">North Kolkata, West Bengal, India</span>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.className.includes('cart-overlay')) setIsCartOpen(false); }}>
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2 className="cart-title">Your Collection</h2>
            <button className="cart-close" onClick={() => setIsCartOpen(false)}><X size={20} /></button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon"><ShoppingCart size={40} /></div>
                <p className="empty-cart-text">Your collection is empty</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: artworkSVG(item) }} style={{width: '100%', height: '100%'}} />
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-medium">{item.medium}</div>
                  <div className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-amount">₹{totalCart.toLocaleString('en-IN')}</span>
              </div>
              {settings.is_taking_orders ? (
                <button className="checkout-btn" onClick={() => { 
                    setCheckoutForm(prev => ({...prev, name: currentUser?.name || '', email: currentUser?.email || ''}));
                    setIsCartOpen(false); 
                    setIsCheckoutOpen(true); 
                }}>Proceed to Order</button>
              ) : (
                <div style={{color: 'var(--rust)', textAlign: 'center', marginTop: '1rem', fontStyle: 'italic'}}>We are currently not accepting orders.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Artwork Modal */}
      <div className={`modal-overlay ${selectedArtwork ? 'open' : ''}`} onClick={(e) => { if (e.target.className.includes('modal-overlay')) setSelectedArtwork(null); }}>
        <div className="modal">
          <button className="modal-close" onClick={() => setSelectedArtwork(null)}><X size={16} /></button>
          <div className="modal-image">
            {selectedArtwork && selectedArtwork.image_url ? (
               <img src={selectedArtwork.image_url} alt={selectedArtwork.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
               <div dangerouslySetInnerHTML={{ __html: selectedArtwork ? artworkSVG(selectedArtwork, true) : '' }} style={{width: '100%', height: '100%'}}></div>
            )}
          </div>
          {selectedArtwork && (
            <div className="modal-info">
              <div className="modal-medium">{selectedArtwork.medium} · {selectedArtwork.year}</div>
              <h2 className="modal-title">{selectedArtwork.title}</h2>
              <div className="modal-size">{selectedArtwork.size}</div>
              <p className="modal-desc">{selectedArtwork.description}</p>
              <div className="modal-price-row">
                <span className="modal-price">₹{selectedArtwork.price?.toLocaleString('en-IN')}</span>
                {selectedArtwork.original_price && <span className="modal-orig">₹{selectedArtwork.original_price.toLocaleString('en-IN')}</span>}
              </div>
              <div className="modal-tags">{selectedArtwork.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}</div>
              <button className="modal-btn" disabled={!selectedArtwork.available} onClick={() => { addToCart(selectedArtwork); setSelectedArtwork(null); }}>
                {selectedArtwork.available ? 'Add to Collection' : 'Sold — Enquire About Similar'}
              </button>
              <button className="modal-btn" style={{background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)'}} onClick={() => { setSelectedArtwork(null); scrollTo('contact'); }}>Commission Similar Piece</button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <div className={`checkout-overlay ${isCheckoutOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.className.includes('checkout-overlay')) setIsCheckoutOpen(false); }}>
        <div className="checkout-modal">
          <div className="checkout-header">
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', fontWeight: 400}}>Place Order</h2>
            <button className="cart-close" onClick={() => setIsCheckoutOpen(false)}><X size={20} /></button>
          </div>
          <div className="checkout-body">
            <div className="checkout-summary">
              {cart.map(i => <div key={i.id} className="checkout-summary-item"><span>{i.title}</span><span>₹{i.price?.toLocaleString('en-IN')}</span></div>)}
              <div className="checkout-summary-total"><span>Total</span><span>₹{totalCart.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="checkout-section-title">Contact Details</div>
            <div className="checkout-grid">
              <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>Full Name *</label><input type="text" className="form-input" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
              <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>Phone *</label><input type="tel" className="form-input" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
            </div>
            <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>Email *</label><input type="email" className="form-input" value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
            <div className="checkout-section-title">Shipping Address</div>
            <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>Street Address *</label><input type="text" className="form-input" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
            <div className="checkout-grid">
              <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>City *</label><input type="text" className="form-input" value={checkoutForm.city} onChange={e => setCheckoutForm({...checkoutForm, city: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
              <div className="form-group"><label className="form-label" style={{color: 'var(--slate)'}}>PIN Code *</label><input type="text" className="form-input" value={checkoutForm.pincode} onChange={e => setCheckoutForm({...checkoutForm, pincode: e.target.value})} style={{background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--fog)'}} /></div>
            </div>
            <button className="form-submit" style={{marginTop: '1rem'}} onClick={submitOrder}>Confirm Order</button>
          </div>
        </div>
      </div>

      {/* User Auth Modal */}
      <div className={`modal-overlay ${isAuthOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.className.includes('modal-overlay')) setIsAuthOpen(false); }}>
        <div className="modal" style={{maxWidth: '400px', gridTemplateColumns: '1fr'}}>
          <button className="modal-close" onClick={() => setIsAuthOpen(false)}><X size={16} /></button>
          <div style={{padding: '3rem 2.5rem', background: 'var(--canvas)'}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', textAlign: 'center', marginBottom: '1.5rem'}}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <form onSubmit={submitAuth}>
              {authMode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} style={{background: 'var(--ivory)', border: '1px solid var(--fog)', color: 'var(--ink)'}} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{background: 'var(--ivory)', border: '1px solid var(--fog)', color: 'var(--ink)'}} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{background: 'var(--ivory)', border: '1px solid var(--fog)', color: 'var(--ink)'}} />
              </div>
              <button type="submit" className="form-submit" style={{marginTop: '1rem'}}>{authMode === 'login' ? 'Sign In' : 'Register'}</button>
            </form>
            <div style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--slate)'}}>
              {authMode === 'login' ? "Don't have an account? " : "Already registered? "}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                style={{background: 'none', border: 'none', color: 'var(--sienna)', cursor: 'pointer', fontWeight: 600}}
              >
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Popup Modal */}
      <div className={`modal-overlay ${isNewsletterOpen ? 'open' : ''}`} onClick={(e) => { if (e.target.className.includes('modal-overlay')) closeNewsletter(); }}>
        <div className="modal" style={{maxWidth: '500px', gridTemplateColumns: '1fr'}}>
          <button className="modal-close" onClick={closeNewsletter}><X size={16} /></button>
          
          <div style={{position:'relative', background: 'var(--ink)', padding: '4rem 3rem', color: 'var(--ivory)', textAlign: 'center'}}>
            <div className="about-eyebrow" style={{justifyContent: 'center', color: 'var(--gold)', marginBottom: '1rem'}}>Ritesh Rakshit Art</div>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 300}}>Join the Studio</h2>
            <p style={{fontSize: '0.8rem', color: 'rgba(245,240,232,0.7)', lineHeight: 1.8, marginBottom: '2rem'}}>
              Subscribe to the inner circle and receive an automated welcome email as a preview of our system. You'll be the first to know about new collections.
            </p>
            <form onSubmit={submitNewsletter} style={{display: 'flex', gap: '0.5rem'}}>
              <input 
                type="email" 
                placeholder="Your email address" 
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                style={{flex: 1, background: 'rgba(245,240,232,0.1)', border: '1px solid rgba(245,240,232,0.3)', padding: '0.8rem 1rem', color: 'white', fontFamily: "'Josefin Sans', sans-serif"}}
              />
              <button type="submit" style={{background: 'var(--gold)', color: 'var(--ink)', border: 'none', padding: '0 1.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Josefin Sans', sans-serif", fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}><Check size={16} className="toast-icon"/> <span id="toast-text">{toast}</span></div>
    </>
  );
}
