import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { FiCoffee, FiShoppingBag, FiClock, FiPower, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shopStatus, setShopStatus] = useState({
    isOpen: true,
    acceptingOrders: true,
    message: '',
  });
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image: null,
    unit: 'units',
    available: true,
    category: 'coffee',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-in-out',
    });
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuResponse, ordersResponse, statusResponse] = await Promise.all([
        axios.get('https://cafe-backend-23gm.onrender.com/api/menu'),
        axios.get('https://cafe-backend-23gm.onrender.com/api/orders'),
        axios.get('https://cafe-backend-23gm.onrender.com/api/shop-status'),
      ]);

      console.log('Menu items:', menuResponse.data);
      console.log('Orders:', ordersResponse.data);
      console.log('Shop status:', statusResponse.data);

      setMenuItems(menuResponse.data || []);
      setOrders(ordersResponse.data || []);
      setShopStatus(statusResponse.data || { isOpen: true, acceptingOrders: true, message: '' });

      const total = ordersResponse.data.length;
      const pending = ordersResponse.data.filter((o) => !o.completed).length;
      setStats({
        totalOrders: total,
        pendingOrders: pending,
        completedOrders: total - pending,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('price', newItem.price);
      formData.append('image', newItem.image);
      formData.append('unit', newItem.unit);
      formData.append('available', newItem.available);
      formData.append('category', newItem.category);
      formData.append('description', newItem.description);

      await axios.post('https://cafe-backend-23gm.onrender.com/api/menu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Item added successfully');
      fetchInitialData();
      setNewItem({
        name: '',
        price: '',
        image: null,
        unit: 'units',
        available: true,
        category: 'coffee',
        description: '',
      });
    } catch (error) {
      console.error('Error adding item:', error);
      setError(`Failed to add item: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (id, available) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`https://cafe-backend-23gm.onrender.com/api/menu/${id}`, { available: !available });
      fetchInitialData();
    } catch (error) {
      console.error('Error updating availability:', error);
      setError(`Failed to update availability: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`https://cafe-backend-23gm.onrender.com/api/menu/${id}`);
        alert('Item deleted successfully');
        fetchInitialData();
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(`Failed to delete item: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateShopStatus = async (field, value) => {
    setLoading(true);
    setError(null);
    try {
      const updatedStatus = { ...shopStatus, [field]: value };
      await axios.put('https://cafe-backend-23gm.onrender.com/api/shop-status', updatedStatus);
      setShopStatus(updatedStatus);
      alert(`Shop ${field} updated successfully`);
    } catch (error) {
      console.error('Error updating shop status:', error);
      setError(`Failed to update shop status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, completed) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`https://cafe-backend-23gm.onrender.com/api/orders/${orderId}`, { completed });
      fetchInitialData();
      alert(`Order marked as ${completed ? 'completed' : 'pending'}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(`Failed to update order status: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getItemName = (itemId) => {
    const item = menuItems.find((i) => i._id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  return (
    <div className="admin-dashboard container-fluid">
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      <div className="dashboard-header bg-dark text-white p-4" data-aos="fade-down">
        <h2 className="mb-0">Admin Dashboard</h2>
        <div className="shop-status d-flex align-items-center mt-3">
          <div className="status-control me-4">
            <button
              className={`btn btn-sm ${shopStatus.isOpen ? 'btn-success' : 'btn-danger'}`}
              onClick={() => updateShopStatus('isOpen', !shopStatus.isOpen)}
              disabled={loading}
            >
              <FiPower className="me-1" />
              {shopStatus.isOpen ? 'Shop Open' : 'Shop Closed'}
            </button>
          </div>
          <div className="status-control">
            <button
              className={`btn btn-sm ${shopStatus.acceptingOrders ? 'btn-success' : 'btn-danger'}`}
              onClick={() => updateShopStatus('acceptingOrders', !shopStatus.acceptingOrders)}
              disabled={loading}
            >
              <FiShoppingBag className="me-1" />
              {shopStatus.acceptingOrders ? 'Accepting Orders' : 'Not Accepting Orders'}
            </button>
          </div>
          <div className="status-control ms-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Status message"
              value={shopStatus.message}
              onChange={(e) => setShopStatus({ ...shopStatus, message: e.target.value })}
              onBlur={() => updateShopStatus('message', shopStatus.message)}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-nav bg-light p-3" data-aos="fade-up">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
              onClick={() => setActiveTab('menu')}
            >
              <FiCoffee className="me-1" /> Menu Management
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiShoppingBag className="me-1" /> Orders ({stats.pendingOrders})
            </button>
          </li>
        </ul>
      </div>

      <div className="dashboard-content p-4">
        {loading ? (
          <div className="text-center py-5">
            <ClipLoader size={50} color="#6F4E37" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'menu' && (
              <>
                <div className="card mb-4" data-aos="fade-up">
                  <div className="card-body">
                    <h3 className="card-title">Add Menu Item</h3>
                    <form onSubmit={handleAddItem}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Item Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Item Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Price (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Price"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            required
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          >
                            <option value="coffee">Coffee</option>
                            <option value="tea">Tea</option>
                            <option value="food">Food</option>
                            <option value="snacks">Snacks</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Unit</label>
                          <select
                            className="form-select"
                            value={newItem.unit}
                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                          >
                            <option value="units">Units</option>
                            <option value="kg">Kilograms</option>
                            <option value="g">Grams</option>
                            <option value="ml">Milliliters</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            placeholder="Item description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            rows="2"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })}
                          />
                        </div>
                        <div className="col-md-6 d-flex align-items-end">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="availableSwitch"
                              checked={newItem.available}
                              onChange={(e) => setNewItem({ ...newItem, available: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="availableSwitch">
                              Available
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <ClipLoader size={20} color="#FFFFFF" /> : 'Add Item'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                <h3 className="mb-3">Menu Items</h3>
                {menuItems.length === 0 ? (
                  <div className="alert alert-info">No menu items available.</div>
                ) : (
                  <div className="row">
                    {menuItems.map((item) => (
                      <div key={item._id} className="col-md-6 col-lg-4 mb-4" data-aos="fade-up">
                        <div className="card h-100">
                          <div className="card-img-container">
                            <img
                              src={item.image ? `https://cafe-backend-23gm.onrender.com${item.image}` : 'https://via.placeholder.com/300?text=No+Image'}
                              alt={item.name}
                              className="card-img-top"
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <span className="badge bg-secondary position-absolute top-0 start-0 m-2">
                              {item.category}
                            </span>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{item.name}</h5>
                            <p className="card-text text-muted">{item.description || 'No description'}</p>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="fw-bold">₹{item.price}</span>
                              <span className="text-muted">/ {item.unit}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <button
                                onClick={() => toggleAvailability(item._id, item.available)}
                                className={`btn btn-sm ${item.available ? 'btn-danger' : 'btn-success'}`}
                                disabled={loading}
                              >
                                {item.available ? 'Make Unavailable' : 'Make Available'}
                              </button>
                              <button
                                onClick={() => deleteItem(item._id)}
                                className="btn btn-sm btn-outline-danger"
                                disabled={loading}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'orders' && (
              <div className="orders-container">
                <div className="row mb-4">
                  <div className="col-md-4" data-aos="fade-up">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h5 className="card-title">Total Orders</h5>
                        <h3 className="text-primary">{stats.totalOrders}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h5 className="card-title">Pending Orders</h5>
                        <h3 className="text-warning">{stats.pendingOrders}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h5 className="card-title">Completed Orders</h5>
                        <h3 className="text-success">{stats.completedOrders}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive" data-aos="fade-up">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Item</th>
                        <th>Customer</th>
                        <th>Quantity</th>
                        <th>Collection</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No orders available.
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order._id}>
                            <td>{order._id.substring(18, 24)}</td>
                            <td>{getItemName(order.itemId)}</td>
                            <td>
                              <div>{order.name}</div>
                              <small className="text-muted">{order.phone}</small>
                            </td>
                            <td>{order.quantity} {order.unit}</td>
                            <td>
                              <div>{order.collectionDate}</div>
                              <small className="text-muted">{order.collectionTime}</small>
                            </td>
                            <td>
                              {order.completed ? (
                                <span className="badge bg-success">Completed</span>
                              ) : (
                                <span className="badge bg-warning text-dark">Pending</span>
                              )}
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${order.completed ? 'btn-danger' : 'btn-success'}`}
                                onClick={() => updateOrderStatus(order._id, !order.completed)}
                                disabled={loading}
                                title={order.completed ? 'Reopen order' : 'Mark as completed'}
                              >
                                {order.completed ? <FiXCircle /> : <FiCheckCircle />}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
