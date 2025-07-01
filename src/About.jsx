import React from 'react';
import { FiCoffee, FiClock, FiMapPin, FiUsers } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <h1 data-aos="fade-up">Our Story</h1>
          <p data-aos="fade-up" data-aos-delay="100">

          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="mb-4">About Friends Coffee Cafe</h2>
           <p>
  Located close to nature in the peaceful town of Punganur, Friends Coffee Café offers a delightful mix of great food and a cozy atmosphere. From delicious biryani in the mornings to a variety of snacks in the evening, we serve something special for every craving.
</p>
<p>
  Our menu features a wide range of refreshing drinks — from classic coffee to soothing green teas — all crafted with care and flavor. With a lovely environment and the option to place orders, Friends Coffee Café is the perfect spot to relax, refuel, and reconnect.
</p>

            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img 
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Coffee shop interior" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose Us</h2>
          <div className="row">
            <div className="col-md-3" data-aos="fade-up">
              <div className="feature-card text-center p-4">
                <FiCoffee className="feature-icon" />
                <h4>Premium Quality</h4>
                <p>Ethically sourced beans from the world's best regions</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-card text-center p-4">
                <FiClock className="feature-icon" />
                <h4>Fast Service</h4>
                <p>Your coffee prepared exactly how you like it, fast</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-card text-center p-4">
                <FiMapPin className="feature-icon" />
                <h4>Perfect Location</h4>
                <p>Right in the heart of the city with cozy ambiance</p>
              </div>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-card text-center p-4">
                <FiUsers className="feature-icon" />
                <h4>Community</h4>
                <p>A welcoming space for friends and creatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <style jsx>{`
        .about-hero {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                      url('https://images.unsplash.com/photo-1463797221720-6b07e6426c24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') no-repeat center center;
          background-size: cover;
          height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: #6F4E37;
          margin-bottom: 1rem;
        }
        
        .feature-card {
          background: white;
          border-radius: 10px;
          transition: transform 0.3s ease;
          height: 100%;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
          .about-hero {
            height: 50vh;
          }
          
          .team-card img {
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default About;