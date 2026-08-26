import HeroBanner from "../components/home/HeroBanner"
import "./HomePage.css"

function HomePage() {
  return (
    <main className="home-page">
      <HeroBanner />

      <section className="home-section home-about">
        <div className="container">
          <span className="home-section-label">
            About Us
          </span>

          <h2>About MN Premium Service</h2>

          <p>
            We proudly provide professional house cleaning
            and premium vehicle care throughout Okinawa City
            and surrounding areas.
          </p>

          <p>
            Our mission is simple: deliver exceptional
            quality, reliable service and outstanding
            customer care in every appointment.
          </p>
        </div>
      </section>

      <section className="home-section home-section-light">
        <div className="container">
          <span className="home-section-label">
            What We Do
          </span>

          <h2>Our Services</h2>

          <div className="services-grid">
            <article className="service-card">
              <span className="service-card-number">
                01
              </span>

              <h3>House Cleaning</h3>

              <p>
                Professional residential cleaning
                customized to the specific needs of
                your home and family.
              </p>

              <ul className="service-card-features">
                <li>Regular house cleaning</li>
                <li>Deep cleaning</li>
                <li>Move-in and move-out cleaning</li>
                <li>Personalized service</li>
              </ul>

              <a href="/house-cleaning">
                Learn More
                <span aria-hidden="true">→</span>
              </a>
            </article>

            <article className="service-card">
              <span className="service-card-number">
                02
              </span>

              <h3>Premium Auto Care</h3>

              <p>
                Professional vehicle washing and
                detailing with careful attention to
                every part of your vehicle.
              </p>

              <ul className="service-card-features">
                <li>Exterior hand wash</li>
                <li>Interior cleaning</li>
                <li>Premium detailing</li>
                <li>Online appointment booking</li>
              </ul>

              <a href="/auto-care">
                Book Now
                <span aria-hidden="true">→</span>
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section home-why">
        <div className="container">
          <span className="home-section-label">
            Our Commitment
          </span>

          <h2>Why Choose Us</h2>

          <div className="home-values-grid">
            <article className="home-value-card">
              <span className="home-value-icon">
                ✓
              </span>

              <div>
                <h3>Professional Quality</h3>

                <p>
                  Careful work and consistent quality
                  standards in every service.
                </p>
              </div>
            </article>

            <article className="home-value-card">
              <span className="home-value-icon">
                ✓
              </span>

              <div>
                <h3>Reliable Service</h3>

                <p>
                  Clear communication and respect for
                  your time, home and vehicle.
                </p>
              </div>
            </article>

            <article className="home-value-card">
              <span className="home-value-icon">
                ✓
              </span>

              <div>
                <h3>Local Okinawa Team</h3>

                <p>
                  Serving Okinawa City and surrounding
                  areas with friendly local service.
                </p>
              </div>
            </article>

            <article className="home-value-card">
              <span className="home-value-icon">
                ✓
              </span>

              <div>
                <h3>Customer Satisfaction</h3>

                <p>
                  We are committed to delivering an
                  excellent customer experience.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-contact">
        <div className="home-contact-content">
          <span>Ready to get started?</span>

          <h2>
            Choose the service you need today.
          </h2>

          <p>
            Professional care for your home and
            your vehicle in Okinawa.
          </p>
        </div>

        <div className="home-contact-actions">
          <a
            className="home-contact-cleaning"
            href="/house-cleaning"
          >
            House Cleaning
          </a>

          <a
            className="home-contact-auto"
            href="/auto-care"
          >
            Book Auto Care
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-left">
            <h3>MN Premium Service</h3>

            <p>
              Professional House Cleaning &amp;
              Premium Auto Care.
            </p>

            <p>© 2026 MN Premium Service.</p>
            <p>All rights reserved.</p>
          </div>

          <div className="home-footer-right">
            <p className="footer-credit">
              Designed &amp; Developed by
            </p>

            <h3>MN Digital Solutions</h3>

            <p className="footer-services">
              Web Development
            </p>

            <p className="footer-services">
              CRM Systems
            </p>

            <p className="footer-services">
              Business Automation
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default HomePage