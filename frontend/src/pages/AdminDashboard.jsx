import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CheckCircle, Clock, Truck, XCircle, LogOut, Check, LayoutDashboard, Brush, ShoppingBag } from 'lucide-react';
import { validateRequired, validatePrice, validateImageFile } from '../utils/formValidation';
import '../styles/AdminDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-3o9b.onrender.com';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [settings, setSettings] = useState({ is_taking_orders: true });
  const [statData, setStatData] = useState({ totalOrders: 0, revenue: 0, artworks: 0 });
  const [orders, setOrders] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [page, setPage] = useState(1);
  const [artFilter, setArtFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [newArt, setNewArt] = useState({
    title: '', category: 'charcoal', medium: '',
    price: '', size: '', description: '', image: null
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings(); fetchOrders(); fetchArtworks(); fetchStats();
    }
  }, [isAuthenticated, page]);

  const getAdminHeader = () => ({ 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, { password });
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', res.data.token);
      showToast('Authenticated successfully');
    } catch (err) { showToast(err.response?.data?.detail || 'Authentication failed'); }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    showToast('Signed out');
  };

  const fetchSettings = async () => {
    try { const res = await axios.get(`${API_BASE}/settings`); setSettings(res.data); } catch {}
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stats`);
      setStatData(prev => ({ ...prev, artworks: res.data.total_artworks || 0 }));
    } catch {}
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/orders?page=${page}&limit=100`, { headers: getAdminHeader() });
      setOrders(res.data.orders);
      const totalRev = res.data.orders.reduce((s, o) => s + (o.total || 0), 0);
      setStatData(prev => ({ ...prev, totalOrders: res.data.total, revenue: totalRev }));
    } catch { showToast('Failed to fetch orders'); }
  };

  const fetchArtworks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/artworks`);
      setArtworks(res.data);
      setStatData(prev => ({ ...prev, artworks: res.data.length }));
    } catch { showToast('Failed to fetch artworks'); }
  };

  const deleteArtwork = async (id) => {
    if (!window.confirm('Delete this artwork permanently?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/artworks/${id}`, { headers: getAdminHeader() });
      showToast('Artwork deleted'); fetchArtworks();
    } catch { showToast('Delete failed'); }
  };

  const toggleSettings = async () => {
    try {
      const newStatus = !settings.is_taking_orders;
      await axios.put(`${API_BASE}/admin/settings`, { is_taking_orders: newStatus }, { headers: getAdminHeader() });
      setSettings({ ...settings, is_taking_orders: newStatus });
      showToast(newStatus ? 'Store is now OPEN' : 'Store is now CLOSED');
    } catch { showToast('Error updating settings'); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE}/admin/orders/${orderId}`, { status }, { headers: getAdminHeader() });
      fetchOrders(); showToast(`Order #${orderId} → ${status}`);
    } catch { showToast('Error updating status'); }
  };

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!validateRequired(newArt.title)) { showToast('Title is required'); return; }
    if (!validateRequired(newArt.medium)) { showToast('Medium is required'); return; }
    if (!validateRequired(newArt.size)) { showToast('Size is required'); return; }
    if (!validatePrice(newArt.price)) { showToast('Enter a valid price'); return; }
    if (!newArt.image) { showToast('Select an image'); return; }
    if (!validateImageFile(newArt.image)) { showToast('Use JPG, PNG or WEBP'); return; }
    setIsUploading(true);
    try {
      const formData = new FormData();
      Object.keys(newArt).forEach(k => formData.append(k, newArt[k]));
      await axios.post(`${API_BASE}/admin/artworks`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...getAdminHeader() }
      });
      showToast('Artwork added!');
      setNewArt({ title: '', category: 'charcoal', medium: '', price: '', size: '', description: '', image: null });
      fetchArtworks();
    } catch (err) { showToast(err.response?.data?.detail || 'Upload failed'); }
    finally { setIsUploading(false); }
  };

  const statusIcon = (s) => {
    switch (s?.toLowerCase()) {
      case 'confirmed':  return <Clock size={14} color="#3b82f6" />;
      case 'processing': return <Package size={14} color="#f97316" />;
      case 'shipped':    return <Truck size={14} color="#10b981" />;
      case 'delivered':  return <CheckCircle size={14} color="#10b981" />;
      case 'cancelled':  return <XCircle size={14} color="#ef4444" />;
      default:           return <Package size={14} />;
    }
  };

  /* ── NAV ITEMS ── */
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'orders',    label: 'Orders',    icon: <ShoppingBag size={18} /> },
    { id: 'artworks',  label: 'Artworks',  icon: <Brush size={18} /> },
  ];

  if (!isAuthenticated) {
    return (
      <div className="admin-login-screen">
        <form onSubmit={login} className="admin-login-card glass-panel">
          <h2 className="admin-login-title">Admin Portal</h2>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="admin-login-input"
          />
          <button type="submit" className="admin-login-btn">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">

      {/* ════ DESKTOP SIDEBAR ════ */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Admin <span>Panel</span></div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-nav-btn admin-logout-btn" onClick={logout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* ════ PAGE CONTENT (mobile header + main) ════ */}
      <div className="admin-content">

        {/* Mobile header — only visible on mobile */}
        <header className="admin-mobile-header">
          <div className="admin-logo">Admin <span>Panel</span></div>
          <button className="admin-logout-icon" onClick={logout} title="Sign Out">
            <LogOut size={20} />
          </button>
        </header>

        {/* Mobile nav tabs — only visible on mobile */}
        <nav className="admin-mobile-tabs">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-tab-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* ════ MAIN ════ */}
        <main className="admin-main">

          {/* DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <>
              <div className="admin-page-header">
                <div>
                  <h1 className="admin-page-title">Overview</h1>
                  <p className="admin-page-sub">Welcome back, Ritesh.</p>
                </div>
                <div className="admin-store-status">
                  <span className="store-label">
                    Store: <strong style={{ color: settings.is_taking_orders ? '#10b981' : '#ef4444' }}>
                      {settings.is_taking_orders ? 'OPEN' : 'CLOSED'}
                    </strong>
                  </span>
                  <button className="admin-toggle-btn" onClick={toggleSettings}>
                    {settings.is_taking_orders ? 'Pause' : 'Open'}
                  </button>
                </div>
              </div>

              <div className="admin-stats-grid">
                {[
                  { label: 'Revenue', value: `₹${statData.revenue?.toLocaleString('en-IN') || 0}` },
                  { label: 'Orders',  value: statData.totalOrders || 0 },
                  { label: 'Artworks', value: statData.artworks || 0, accent: true },
                ].map(s => (
                  <div key={s.label} className={`admin-stat-card ${s.accent ? 'accent' : ''}`}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ORDERS TABLE */}
          {(activeView === 'dashboard' || activeView === 'orders') && (
            <div className="admin-card">
              {activeView === 'orders' && <h2 className="admin-card-title">All Orders</h2>}
              <div className="table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order Ref</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="5" className="table-empty">No orders yet</td></tr>
                    ) : orders.map(order => (
                      <tr key={order.id}>
                        <td className="mono">#{order.id}</td>
                        <td>
                          <div className="td-name">{order.name}</div>
                          <div className="td-sub">{order.email}</div>
                        </td>
                        <td>₹{order.total?.toLocaleString('en-IN')}</td>
                        <td>
                          <div className="status-cell">
                            {statusIcon(order.status)}
                            <span>{order.status}</span>
                          </div>
                        </td>
                        <td>
                          {['delivered', 'cancelled'].includes(order.status) ? (
                            <span className={`status-badge ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          ) : (
                            <select
                              className="status-select"
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="confirmed" disabled={['processing', 'shipped'].includes(order.status)}>Confirmed</option>
                              <option value="processing" disabled={order.status === 'shipped'}>Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ARTWORKS VIEW */}
          {activeView === 'artworks' && (
            <div className="artworks-view">

              {/* Add form */}
              <div className="admin-card">
                <h2 className="admin-card-title">Add New Artwork</h2>
                <form onSubmit={handleAddArtwork} className="artwork-form">
                  <div className="form-field">
                    <label>Title *</label>
                    <input 
                      type="text" 
                      id="artwork-title-input"
                      placeholder="e.g., Whispers of the Soul"
                      value={newArt.title} 
                      onChange={e => setNewArt({ ...newArt, title: e.target.value })} 
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Category *</label>
                    <select value={newArt.category} onChange={e => setNewArt({ ...newArt, category: e.target.value })}>
                      <option value="charcoal">Charcoal</option>
                      <option value="oil-painting">Oil Painting</option>
                      <option value="pencil-sketch">Pencil Sketching</option>
                      <option value="acrylic-painting">Acrylic Painting</option>
                      <option value="acrylic-fiber-portrait">Fiber Portrait</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Medium *</label>
                    <input type="text" placeholder="e.g., Oil on Canvas"
                      value={newArt.medium} onChange={e => setNewArt({ ...newArt, medium: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>Size *</label>
                    <input type="text" placeholder="e.g., 24 × 36 inches"
                      value={newArt.size} onChange={e => setNewArt({ ...newArt, size: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>Price (₹) *</label>
                    <input type="number" placeholder="Amount"
                      value={newArt.price} onChange={e => setNewArt({ ...newArt, price: e.target.value })} />
                  </div>
                  <div className="form-field">
                    <label>Image *</label>
                    <input type="file" accept="image/*"
                      onChange={e => setNewArt({ ...newArt, image: e.target.files[0] })} />
                  </div>
                  <div className="form-field full-width">
                    <label>Description</label>
                    <textarea placeholder="Tell us about this artwork..."
                      value={newArt.description} onChange={e => setNewArt({ ...newArt, description: e.target.value })} />
                  </div>
                  <div className="full-width">
                    <button type="submit" className="artwork-submit-btn" disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Save Artwork to Gallery'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Artworks table */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h2 className="admin-card-title">Existing Artworks</h2>
                  <div className="admin-card-actions">
                    <select 
                      className="status-select" 
                      value={artFilter} 
                      onChange={e => setArtFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="sold">Sold Out</option>
                    </select>
                  </div>
                </div>
                <div className="table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artworks
                        .filter(art => {
                          if (artFilter === 'available') return art.available;
                          if (artFilter === 'sold') return !art.available;
                          return true;
                        })
                        .length === 0 ? (
                        <tr><td colSpan="6" className="table-empty">No artworks match the filter</td></tr>
                      ) : artworks
                        .filter(art => {
                          if (artFilter === 'available') return art.available;
                          if (artFilter === 'sold') return !art.available;
                          return true;
                        })
                        .map(art => (
                        <tr key={art.id}>
                          <td>
                            <img src={art.image_url} alt={art.title} className="art-thumb" />
                          </td>
                          <td style={{ cursor: 'pointer' }}>
                            <div className="td-name">{art.title}</div>
                            <div className="td-sub">{art.size}</div>
                          </td>
                          <td>{art.category}</td>
                          <td>₹{art.price?.toLocaleString('en-IN')}</td>
                          <td>
                            <span className={`status-badge ${art.available ? 'available' : 'sold'}`}>
                              {art.available ? 'Available' : 'Sold'}
                            </span>
                          </td>
                          <td>
                            <button className="delete-btn" onClick={() => deleteArtwork(art.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Toast */}
      <div className={`admin-toast ${toast ? 'show' : ''}`}>
        <Check size={14} /> {toast}
      </div>
    </div>
  );
}
