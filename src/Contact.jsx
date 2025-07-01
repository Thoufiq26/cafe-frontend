import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for your message, ${formData.name}! We'll contact you soon.`);
    setFormData({ name: '', email: '', message: '' });
  };

  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 data-aos="fade-up">Get In Touch</h1>
          <p data-aos="fade-up" data-aos-delay="100">
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="mb-4">Contact Information</h2>
              
              <div className="contact-info mb-5">
                <div className="info-item d-flex mb-4">
                  <FiMapPin className="me-3" size={24} />
                  <div>
                    <h5>Address</h5>
                    <p>9HJ7+7FH, Near GRS Restaurant,
Punganur, Andhra Pradesh – 517247,
India</p>
                  </div>
                </div>
                
                <div className="info-item d-flex mb-4">
                  <FiPhone className="me-3" size={24} />
                  <div>
                    <h5>Phone</h5>
                    <p>+91 94407 33910</p>
                  </div>
                </div>
                
                <div className="info-item d-flex mb-4">
                  <FiMail className="me-3" size={24} />
                  <div>
                    <h5>Email</h5>
                    <p>thoufiqaa11@gmail.com</p>
                  </div>
                </div>
                
                <div className="info-item d-flex">
                  <FiClock className="me-3" size={24} />
                  <div>
                    <h5>Opening Hours</h5>
                    <p>Monday-Sunday: 5:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h5 className="mb-3">Follow Us</h5>
                <div className="d-flex">
                  <a href="#" className="social-icon me-3">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="social-icon me-3">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#" className="social-icon me-3">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="bi bi-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6" data-aos="fade-left">
              <div className="contact-form card shadow-sm p-4">
                <h3 className="mb-4">Send Us a Message</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea 
                      className="form-control" 
                      id="message" 
                      rows="5"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section" data-aos="fade-up">
        <div className="container-fluid p-0">
          <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.496077812753!2d78.56056387314605!3d13.381580105761122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb27bff2c2e5797%3A0x6edf014dd7a3984d!2s9HJ7%2B7FH%2C%20Punganur%2C%20Andhra%20Pradesh%20517247!5e0!3m2!1sen!2sin!4v1751378786313!5m2!1sen!2sin"
  width="100%"
  height="450"
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

        </div>
      </section>

      <style jsx>{`
        .contact-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                      url('https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') no-repeat center center;
          background-size: cover;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
        }
        
        .contact-form {
          background: white;
          border-radius: 10px;
        }
        
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #f8f9fa;
          border-radius: 50%;
          color: #6F4E37;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          background: #6F4E37;
          color: white;
          transform: translateY(-3px);
        }
        
        @media (max-width: 768px) {
          .contact-hero {
            height: 40vh;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;