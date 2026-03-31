import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Package, Clock, Truck, CheckCircle, ShoppingBag, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/UserDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-3o9b.onrender.com';

const StatusTimeline = ({ currentStatus }) => {
  const stages = [
    { id: 'confirmed', label: 'Confirmed', icon: <Package size={16} /> },
    { id: 'processing', label: 'Preparing', icon: <Clock size={16} /> },
    { id: 'shipped', label: 'In Transit', icon: <Truck size={16} /> },
    { id: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> }
  ];

  const currentIndex = stages.findIndex(s => s.id === currentStatus);

  return (
    <div className="timeline-container" style={{marginTop: '30px', position: 'relative'}}>
      <div className="timeline-track" style={{position: 'absolute', top: '18px', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)'}}>
        <div 
          className="timeline-progress" 
          style={{ height: '100%', background: 'var(--gold)', width: `${(currentIndex / (stages.length - 1)) * 100}%`, transition: 'width 1.5s ease' }}
        />
      </div>
      
      <div className="timeline-steps" style={{display:'flex', justifyContent:'space-between', position:'relative'}}>
        {stages.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          
          return (
            <div key={stage.id} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', zIndex:2}}>
              <div className="step-node" style={{
                width: '38px', height: '38px', borderRadius: '50%', background: isActive ? 'var(--gold)' : '#1a1a1e', 
                border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isActive ? 'black' : (isCompleted ? 'var(--gold)' : '#444')
              }}>
                {stage.icon}
              </div>
              <span className="step-label" style={{
                fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', 
                color: isActive ? 'var(--gold)' : (isCompleted ? 'white' : '#444')
              }}>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('art_user') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.email) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/orders`, {
        headers: { 'Authorization': `Bearer ${user.email}` }
      });
      setOrders(res.data);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('art_user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-root">
      <div className="container">
        <header className="db-header" style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '2.5rem', marginBottom: '3rem'}}>
          <div>
            <Link to="/" className="back-link" style={{display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.2rem'}}>
              <ArrowLeft size={14} /> Back to Gallery
            </Link>
            <h1 className="welcome-title">Welcome back, <span>{user.name || 'Collector'}</span></h1>
          </div>
          <button onClick={logout} className="logout-btn" style={{border: '1px solid rgba(201,168,76,0.2)', color: 'white', padding: '0.8rem 1.6rem', fontSize: '0.7rem', background: 'transparent', cursor: 'pointer', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.2em'}}>
            Logout
          </button>
        </header>

        <main className="db-grid">
          <div className="orders-area">
            <h2 className="section-title" style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              Active Acquisitions <span className="order-count" style={{fontSize: '10px', background: 'var(--gold)', color: 'black', padding: '2px 10px', borderRadius: '12px'}}>{orders.length}</span>
            </h2>

            {loading ? (
              <div style={{ opacity: 0.5 }}>
                {[...Array(2)].map((_, i) => (
                  <div key={i} style={{ height: '240px', background: '#141417', marginBottom: '30px', borderRadius:'8px' }} />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="empty-state" style={{textAlign: 'center', padding: '5rem 0', border: '1px dashed rgba(201,168,76,0.2)', borderRadius: '12px'}}>
                <ShoppingBag size={40} strokeWidth={1} color="var(--gold)" style={{ marginBottom: '20px' }} />
                <p style={{ fontStyle: 'italic', color: '#8e8e93', marginBottom: '1.5rem' }}>Your collection is currently empty.</p>
                <Link to="/" style={{ color: 'var(--gold)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', textDecoration: 'none', borderBottom: '1px solid' }}>Explore Works</Link>
              </div>
            ) : (
              <div className="order-list">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="order-card"
                  >
                    <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '1.5rem'}}>
                      <div className="ord-meta">
                        <h4 style={{fontSize: '0.6rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px'}}>Tracking Ref</h4>
                        <p style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 300}}>ORD-{order.id.toUpperCase()}</p>
                      </div>
                      <div className="ord-meta" style={{ textAlign: 'right' }}>
                        <h4 style={{fontSize: '0.6rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '4px'}}>Valuation</h4>
                        <p style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', fontWeight: 300}}>₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="item-tags" style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '3rem'}}>
                      {order.items.map((item, i) => (
                        <span key={i} className="tag" style={{fontSize: '0.65rem', padding: '4px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#8e8e93', textTransform: 'uppercase'}}>{item.title || item.id}</span>
                      ))}
                    </div>

                    <StatusTimeline currentStatus={order.status} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="sidebar-area">
            <aside className="profile-panel">
              <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '2rem', fontFamily: "'Cormorant Garamond', serif" }}>Collector Profile</h3>
              <div className="profile-items">
                <div className="p-field" style={{marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '1rem'}}>
                  <span className="p-label" style={{fontSize: '0.6rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px'}}>Identity</span>
                  <span className="p-val" style={{fontSize: '0.9rem', fontWeight: 300}}>{user.name}</span>
                </div>
                <div className="p-field" style={{marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '1rem'}}>
                  <span className="p-label" style={{fontSize: '0.6rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px'}}>Email Address</span>
                  <span className="p-val" style={{fontSize: '0.9rem', fontWeight: 300}}>{user.email}</span>
                </div>
                <div className="p-field" style={{marginBottom: '1.5rem'}}>
                  <span className="p-label" style={{fontSize: '0.6rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '4px'}}>Membership</span>
                  <span className="p-val" style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 500 }}>Patron Collector</span>
                </div>
              </div>

              <div className="collector-badge" style={{background: 'rgba(201,168,76,0.05)', padding: '1.5rem', border: '1px dashed rgba(201,168,76,0.2)', fontSize: '0.75rem', lineHeight: 1.6, color: '#8e8e93', marginTop: '2.5rem'}}>
                Your acquisitions are prioritized for premium handling and studio verification.
              </div>
              
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '1.5rem' }}>
                <Link to="/" style={{ fontSize: '10px', color: '#8e8e93', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ExternalLink size={12} /> Contact Studio for Inquiries
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
