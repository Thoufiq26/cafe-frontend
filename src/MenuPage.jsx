/* eslint-env browser */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {
  FiCoffee,
  FiPhone,
  FiMapPin,
  FiStar,
  FiShoppingCart,
  FiCheckCircle,
} from "react-icons/fi";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [order, setOrder] = useState({
    items: [],
    name: "",
    phone: "",
    collectionTime: "",
    collectionDate: "",
  });
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newRating, setNewRating] = useState({
    name: "",
    itemId: "",
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [shopStatus, setShopStatus] = useState({
    isOpen: true,
    acceptingOrders: true,
    message: "",
  });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [menuResponse, ratingsResponse, statusResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/menu"),
          axios.get("http://localhost:5000/api/ratings"),
          axios.get("http://localhost:5000/api/shop-status"),
        ]);
        console.log("Menu response:", menuResponse.data);
        console.log("Ratings response:", ratingsResponse.data);
        console.log("Shop status response:", statusResponse.data);
        setMenuItems(menuResponse.data || []);
        setRatings(ratingsResponse.data || []);
        setShopStatus(statusResponse.data || { isOpen: true, acceptingOrders: true, message: "" });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load data: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOrder = (cartItems) => {
    if (!shopStatus.acceptingOrders) {
      alert("We're currently not accepting orders. Please check back later.");
      return;
    }
    setOrder({
      items: cartItems.map((item) => ({
        itemId: item._id,
        quantity: item.quantity,
        unit: item.unit || "",
      })),
      name: "",
      phone: "",
      collectionTime: "",
      collectionDate: "",
    });
    setShowOrderModal(true);
  };

  const addToCart = (item) => {
    if (!shopStatus.acceptingOrders) {
      alert("We're currently not accepting orders. Please check back later.");
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item._id !== itemId));
  };

  const updateCartItem = (itemId, quantity) => {
    setCart(
      cart.map((item) => (item._id === itemId ? { ...item, quantity } : item))
    );
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    const selectedTime = new Date(`1970-01-01T${order.collectionTime}:00`);
    const startTime = new Date(`1970-01-01T07:00:00`);
    const endTime = new Date(`1970-01-01T22:00:00`);
    if (selectedTime < startTime || selectedTime > endTime) {
      alert("Please select a collection time between 7:00 AM and 10:00 PM.");
      return;
    }
    setShowOrderModal(false);
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/orders", order);
      alert("Order placed successfully! Admin notified via WhatsApp.");
      setShowConfirmModal(false);
      setOrder({
        items: [],
        name: "",
        phone: "",
        collectionTime: "",
        collectionDate: "",
      });
      setCart([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(`Order failed: ${error.response?.data?.message || "Server error"}`);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/ratings", newRating);
      const response = await axios.get("http://localhost:5000/api/ratings");
      setRatings(response.data || []);
      setNewRating({ name: "", itemId: "", rating: 0, comment: "" });
      alert("Thank you for your rating!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating. Please try again.");
    }
  };

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      (item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase() || "") ||
        item?.unit?.toLowerCase()?.includes(searchQuery?.toLowerCase() || "")) &&
      (activeCategory === "all" || item.category === activeCategory) &&
      item.available
  );

  const averageRatings = {};
  ratings.forEach((rating) => {
    if (!averageRatings[rating.itemId]) {
      averageRatings[rating.itemId] = { sum: 0, count: 0 };
    }
    averageRatings[rating.itemId].sum += rating.rating;
    averageRatings[rating.itemId].count += 1;
  });

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark fixed-top ${
          scrolled ? "bg-dark shadow" : "bg-transparent"
        }`}
      >
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="logo-placeholder me-2">
              <img
                src="https://images.unsplash.com/photo-1517705008128-361805f42e86?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=60&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29mZmVlLGxvZ298fHx8fHwxNjg1MjE4NDQ0&ixlib=rb-4.0.3&q=80&w=60"
                alt="Friends Coffee Cafe Logo"
                className="logo-img rounded-circle"
              />
            </div>
            <span className="fw-bold">Friends Coffee</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/menu" className="nav-link text-light">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link text-light">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link text-light">
                  Contact
                </Link>
              </li>
            </ul>
            <form
              className="d-flex ms-auto me-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="input-group">
                <input
                  className="form-control border-0 bg-light"
                  type="search"
                  placeholder="Search Menu..."
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery(e.target.value || "")}
                  aria-label="Search menu items"
                />
                <button
                  className="btn btn-outline-light"
                  type="submit"
                  aria-label="Search"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
            <ul className="navbar-nav align-items-center">
              {/* Shop Status Indicator */}
              <li className="nav-item me-2">
                <span
                  className={`d-flex align-items-center text-white ${
                    shopStatus.isOpen ? 'bg-success' : 'bg-danger'
                  } rounded-pill px-2 py-1`}
                  style={{ fontSize: '0.9rem' }}
                >
                  <span
                    className="rounded-circle me-1"
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: shopStatus.isOpen ? '#28a745' : '#dc3545',
                    }}
                  ></span>
                  {shopStatus.isOpen ? 'Shop Open' : `Shop Closed${shopStatus.message ? `: ${shopStatus.message}` : ''}`}
                </span>
              </li>
              <li className="nav-item">
                <Link to="/admin-login" className="btn btn-outline-light ms-2">
                  <i className="bi bi-person-fill-gear me-2"></i>Admin
                </Link>
              </li>
              <li className="nav-item position-relative">
                <button
                  className="btn btn-outline-light ms-2 position-relative"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#cartOffcanvas"
                >
                  <FiShoppingCart className="me-1" />
                  {cart.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cart.length}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content text-center text-white">
          <h1 className="display-3 fw-bold mb-4" data-aos="fade-up">
            Friends Coffee Cafe
          </h1>
          <p className="lead mb-5" data-aos="fade-up" data-aos-delay="100">
            Crafting the perfect cup since 2010
          </p>
          <Link
            to="/menu"
            className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Explore Our Menu
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-5">
        {loading && (
          <div className="text-center py-5">
            <ClipLoader size={50} color="#6F4E37" />
            <p>Loading data...</p>
          </div>
        )}
        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}
        {!loading && !error && menuItems.length === 0 && (
          <div className="alert alert-info text-center">
            No menu items available.
          </div>
        )}

        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" data-aos="fade-up">
              Our Menu
            </h2>
            <div className="category-filter" data-aos="fade-up">
              <div className="btn-group" role="group">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`btn ${
                      activeCategory === category
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="col-md-6 col-lg-4"
                data-aos="fade-up"
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-img-top position-relative overflow-hidden">
                    <img
                      src={
                        item.image
                          ? `http://localhost:5000${item.image}`
                          : "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={item.name || "Menu Item"}
                      className="img-fluid w-100"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    {averageRatings[item._id] && (
                      <div className="position-absolute top-0 end-0 bg-primary text-white p-2 rounded-bl">
                        {Math.round(
                          (averageRatings[item._id].sum /
                            averageRatings[item._id].count) *
                            10
                        ) / 10}{" "}
                        ★
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold mb-0">
                        {item.name || "Unnamed Item"}
                      </h5>
                      <span className="badge bg-secondary">
                        {item.category || "Uncategorized"}
                      </span>
                    </div>
                    <p className="card-text text-muted">
                      {item.description || "No description available"}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className="h5 text-primary">
                          ₹{item.price || "N/A"}
                        </span>
                        <small className="text-muted ms-1">
                          / {item.unit || "unit"}
                        </small>
                      </div>
                      <div className="btn-group">
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-sm btn-outline-primary"
                          disabled={loading || !shopStatus.acceptingOrders}
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleOrder([{ ...item, quantity: 1 }])}
                          className="btn btn-sm btn-primary"
                          disabled={loading || !shopStatus.acceptingOrders}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fw-bold mb-4 text-center" data-aos="fade-up">
            What Our Customers Say
          </h2>
          {ratings.length === 0 ? (
            <div className="alert alert-info text-center">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="row g-4">
              {ratings.slice(0, 3).map((rating, index) => {
                const item = menuItems.find((i) => i._id === rating.itemId);
                return (
                  <div
                    key={index}
                    className="col-md-4"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <FiStar
                                key={i}
                                className={
                                  i < rating.rating
                                    ? "text-warning fill"
                                    : "text-muted"
                                }
                                style={{ margin: "0 2px" }}
                              />
                            ))}
                        </div>
                        <p className="card-text mb-4 fst-italic">
                          "{rating.comment || "No comment"}"
                        </p>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={`https://i.pravatar.cc/60?img=${index + 10}`}
                            alt={rating.name}
                            className="rounded-circle me-3"
                            width="40"
                          />
                          <div>
                            <h6 className="mb-0 fw-bold">
                              {rating.name || "Anonymous"}
                            </h6>
                            <small className="text-muted">
                              {item?.name || "Unknown Item"}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-5">
          <div className="card border-0 shadow-sm" data-aos="fade-up">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4 text-center">
                Share Your Experience
              </h3>
              <form onSubmit={submitRating}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      value={newRating.name || ""}
                      onChange={(e) =>
                        setNewRating({ ...newRating, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={newRating.itemId || ""}
                      onChange={(e) =>
                        setNewRating({ ...newRating, itemId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Menu Item</option>
                      {menuItems.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name || "Unnamed Item"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex align-items-center mb-3">
                      <span className="me-2">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`star-rating ${
                            star <= newRating.rating
                              ? "text-warning fill"
                              : "text-muted"
                          }`}
                          onClick={() =>
                            setNewRating({ ...newRating, rating: star })
                          }
                          style={{ cursor: "pointer", margin: "0 2px" }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      placeholder="Your feedback..."
                      rows="3"
                      value={newRating.comment || ""}
                      onChange={(e) =>
                        setNewRating({ ...newRating, comment: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-primary px-4">
                      Submit Review
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <h2 className="fw-bold mb-4 text-center" data-aos="fade-up">
            Visit Us
          </h2>
          <div className="row g-4">
            <div className="col-md-6" data-aos="fade-right">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4">
                    <FiMapPin className="me-2" /> Our Location
                  </h4>
                  <p className="mb-4">
                    123 Cafe Street, Hyderabad, Telangana, India
                  </p>
                  <div className="mb-4">
                    <h5>Opening Hours</h5>
                    <p className="mb-1">Monday - Friday: 7:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 8:00 AM - 11:00 PM</p>
                  </div>
                  <div>
                    <h5>
                      <FiPhone className="me-2" /> Contact Us
                    </h5>
                    <p className="mb-1">Phone: +91 94407 33910</p>
                    <p>Email: info@friendscoffeecafe.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6" data-aos="fade-left">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-0">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.263318410632!2d78.4484144153847!3d17.44855050534816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9158f201b205%3A0x5c3f5a5a5a5a5a5a!2sFriends%20Coffee%20Cafe!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "300px", border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-4">Friends Coffee Cafe</h5>
              <p>
                We're passionate about serving the finest coffee in a warm,
                welcoming environment that feels like home.
              </p>
              <div className="social-icons mt-4">
                <a href="#" className="text-white me-3">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-white me-3">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-white me-3">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-white">
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link to="/" className="text-white text-decoration-none">
                    Home
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/menu" className="text-white text-decoration-none">
                    Menu
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/about" className="text-white text-decoration-none">
                    About
                  </Link>
                </li>
                <li className="mb-2">
                  <Link to="/contact" className="text-white text-decoration-none">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Contact Info</h5>
              <p>
                <FiMapPin className="me-2" /> 123 Cafe Street, Hyderabad, India
              </p>
              <p>
                <FiPhone className="me-2" /> +91 94407 33910
              </p>
              <p>Open daily: 7:00 AM - 10:00 PM</p>
            </div>
            <div className="col-lg-3">
              <h5 className="fw-bold mb-4">Newsletter</h5>
              <p>Subscribe to get updates on special offers</p>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your Email"
                />
                <button className="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} Friends Coffee Cafe. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      {showOrderModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Place Your Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowOrderModal(false)}
                ></button>
              </div>
              <form onSubmit={submitOrder}>
                <div className="modal-body">
                  <div className="mb-3">
                    <h6 className="fw-bold">Order Items</h6>
                    {order.items.map((orderItem, index) => {
                      const item = menuItems.find((i) => i._id === orderItem.itemId);
                      return (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{item?.name || "Unknown Item"}</span>
                          <input
                            type="number"
                            className="form-control w-25"
                            value={orderItem.quantity || ""}
                            onChange={(e) => {
                              const newItems = [...order.items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              setOrder({ ...order, items: newItems });
                            }}
                            required
                            min="1"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={order.name || ""}
                      onChange={(e) => setOrder({ ...order, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={order.phone || ""}
                      onChange={(e) => setOrder({ ...order, phone: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Collection Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={order.collectionDate || ""}
                        onChange={(e) =>
                          setOrder({ ...order, collectionDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Collection Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={order.collectionTime || ""}
                        onChange={(e) =>
                          setOrder({ ...order, collectionTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Next
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowOrderModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Confirm Your Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6 className="fw-bold">Order Summary</h6>
                  <div className="card border-0 bg-light p-3">
                    {order.items.map((orderItem, index) => {
                      const item = menuItems.find((i) => i._id === orderItem.itemId);
                      return (
                        <div key={index} className="mb-2">
                          <div className="d-flex justify-content-between">
                            <span>Item:</span>
                            <span>{item?.name || "Unknown"}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Quantity:</span>
                            <span>
                              {orderItem.quantity} {orderItem.unit}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Price:</span>
                            <span>₹{(item?.price * orderItem.quantity) || "N/A"}</span>
                          </div>
                        </div>
                      );
                    })}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total:</span>
                      <span>
                        ₹
                        {order.items.reduce((sum, orderItem) => {
                          const item = menuItems.find((i) => i._id === orderItem.itemId);
                          return sum + (item?.price || 0) * orderItem.quantity;
                        }, 0)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <h6 className="fw-bold">Collection Details</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Name:</strong> {order.name || "N/A"}
                    </li>
                    <li className="mb-2">
                      <strong>Phone:</strong> {order.phone || "N/A"}
                    </li>
                    <li className="mb-2">
                      <strong>Date:</strong> {order.collectionDate || "N/A"}
                    </li>
                    <li>
                      <strong>Time:</strong> {order.collectionTime || "N/A"}
                    </li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={confirmOrder}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={20} color="#FFFFFF" />
                  ) : (
                    <>
                      <FiCheckCircle className="me-2" />
                      Confirm Order
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="offcanvas offcanvas-end" tabIndex="-1" id="cartOffcanvas">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Your Order</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {cart.length === 0 ? (
            <div className="text-center py-4">
              <FiShoppingCart size={48} className="text-muted mb-3" />
              <p>Your cart is empty</p>
              <Link
                to="/menu"
                className="btn btn-primary"
                data-bs-dismiss="offcanvas"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="list-group mb-3">
                {cart.map((item) => (
                  <div key={item._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">
                          ₹{item.price} per {item.unit}
                        </small>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateCartItem(
                              item._id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateCartItem(item._id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => removeFromCart(item._id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card border-0 bg-light p-3 mb-3">
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total:</span>
                  <span>
                    ₹
                    {cart.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  if (cart.length > 0) {
                    handleOrder(cart);
                    const bsOffcanvas = document.getElementById('cartOffcanvas');
                    const offcanvas = window.bootstrap.Offcanvas.getInstance(bsOffcanvas);
                    if (offcanvas) {
                      offcanvas.hide();
                    }
                  }
                }}
                disabled={!shopStatus.acceptingOrders}
              >
                {shopStatus.acceptingOrders ? 'Proceed to Checkout' : 'Orders Currently Closed'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;