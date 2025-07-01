import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';// import AdminLogin from './components/AdminLogin';
// import AdminDashboard from './components/AdminDashboard';
// import HomePage from './components/HomePage';
// import MenuPage from './components/MenuPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { motion, useScroll, useTransform } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
//   const [isAdmin, setIsAdmin] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: 'ease-in-out',
    });

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
   
      <div className="min-vh-100 d-flex flex-column bg-light">
        {/* Animated Hero Section */}
        <motion.div 
          className="hero-section position-relative overflow-hidden"
          style={{ scale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="hero-overlay position-absolute w-100 h-100"></div>
          <div className="hero-content position-relative text-center text-white d-flex flex-column justify-content-center align-items-center">
            <motion.h1 
              className="display-3 fw-bold mb-4"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Friends Coffee Cafe
            </motion.h1>
            <motion.p 
              className="lead mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
Friendship begins over a cup            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
            >
              <Link to="/menu" className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow">
                Explore Our Menu
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation */}
        

          {/* Featured Products Section */}
          <section className="py-5 bg-white">
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" data-aos="fade-up">Our Signature Blends</h2>
              <div className="row g-4">
                {[
                  {
                    id: 1,
                    name: "Biryani",
desc: "Aromatic rice with rich spices and tender meat",

                    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D"
                  },
                  {
                    id: 2,
                  name: "Filter Coffee",
  desc: "Strong South Indian coffee with rich aroma",
                    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29mZmVlfGVufDB8fDB8fHww"
                  },
                  {
                    id: 3,
                      name: "Spicy Chicken Roll",
  desc: "Chicken cooked in spicy masala, rolled with onions and chutney",
                    image: "https://plus.unsplash.com/premium_photo-1679287668420-80c27ea4fb31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHdyYXB8ZW58MHx8MHx8fDA%3Ds"
                  }
                ].map((product, index) => (
                  <div className="col-md-4" key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <motion.div 
                      className="card border-0 shadow-sm h-100 overflow-hidden"
                      whileHover={{ y: -10 }}
                    >
                      <div className="card-img-top overflow-hidden" style={{ height: '250px' }}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{product.name}</h5>
                        <p className="card-text text-muted">{product.desc}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-primary fw-bold">{product.price}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Parallax Section */}
          <section className="parallax-section py-5 d-flex align-items-center">
            <div className="container text-center text-white">
              <h2 className="display-4 fw-bold mb-4" data-aos="fade-up">Experience Coffee Like Never Before</h2>
              <p className="lead mb-5" data-aos="fade-up" data-aos-delay="100">
                Our baristas craft each cup with precision and passion
              </p>
              <Link 
                to="/menu" 
                className="btn btn-light btn-lg px-4 py-3 rounded-pill shadow"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Visit Our Cafe
              </Link>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-5 bg-light">
            <div className="container">
              <h2 className="text-center mb-5 fw-bold" data-aos="fade-up">What Our Customers Say</h2>
              <div className="row g-4">
                {[

  {
    id: 1,
    name: "Vikram Reddy",
    role: "Biryani Lover",
    text: "Mee café lo Hyderabadi Biryani chala tasty. Perfect spice and aroma!",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
  },
  {
    id: 2,
    name: "Sai Teja",
    role: "Coffee Addict",
    text: "Filter coffee taste super. Every sip reminds me of home!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4lZYNTcEWjMNOUw0pwNdVHHnxgCRb_Ed8JQ&s"
  },
  {
    id: 3,
    name: "Naveen Kumar",
    role: "Street Food Fan",
    text: "Chicken roll lo flavor full kick undi. Must try!",
    image: "https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"
  }



                ].map((testimonial, index) => (
                  <div className="col-md-4" key={testimonial.id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="rounded-circle mb-3" 
                          width="80"
                          height="80"
                        />
                        <p className="card-text mb-4">"{testimonial.text}"</p>
                        <h5 className="card-title fw-bold mb-1">{testimonial.name}</h5>
                        <small className="text-muted">{testimonial.role}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        {/* Footer */}
       <footer className="footer bg-dark text-white pt-5 pb-4">
  <div className="container">
    <div className="row g-4">
      <div className="col-lg-4" data-aos="fade-up">
        <h5 className="fw-bold mb-4">Friends Coffee Cafe</h5>
        <p>We're passionate about serving the finest coffee in a warm, welcoming environment that feels like home.</p>
        <div className="social-icons mt-4">
          <a href="https://www.facebook.com/friendscoffeecafe" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://www.instagram.com/friendscoffeecafe" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="https://www.twitter.com/friendscoffeecafe" className="text-white me-3" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://www.tiktok.com/@friendscoffeecafe" className="text-white" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-tiktok"></i>
          </a>
        </div>
      </div>
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
        <h5 className="fw-bold mb-4">Quick Links</h5>
        <ul className="list-unstyled">
          <li className="mb-2"><Link to="/" className="text-white text-decoration-none">Home</Link></li>
          <li className="mb-2"><Link to="/menu" className="text-white text-decoration-none">Menu</Link></li>
          <li className="mb-2"><Link to="/about" className="text-white text-decoration-none">About Us</Link></li>
          <li className="mb-2"><Link to="/contact" className="text-white text-decoration-none">Contact</Link></li>
          <li><Link to="/admin-login" className="text-white text-decoration-none">Admin</Link></li>
        </ul>
      </div>
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
        <h5 className="fw-bold mb-4">Contact Us</h5>
        <p><i className="bi bi-geo-alt-fill me-2"></i> 9HJ7+7FH, Near GRS Restaurant,
Punganur, Andhra Pradesh – 517247,
India</p>
        <p><i className="bi bi-telephone-fill me-2"></i> +91 94407 33910</p>
        <p><i className="bi bi-envelope-fill me-2"></i> thoufiqaa11@gmail.com</p>
        <p><i className="bi bi-clock-fill me-2"></i> Open daily: 5:00 AM - 7:00 PM</p>
      </div>
    </div>
    <hr className="my-4" />
    <div className="row">
      <div className="col-md-12 text-center">
        <p className="mb-0">© {new Date().getFullYear()} Friends Coffee Cafe. All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>
      </div>
  );
};

export default HomePage;