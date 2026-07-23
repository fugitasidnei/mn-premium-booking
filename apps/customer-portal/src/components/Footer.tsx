import "./Footer.css"

const QUICK_LINKS = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Booking",
    href: "#booking",
  },
  {
    label: "Loyalty",
    href: "#loyalty",
  },
  {
    label: "Priority Access",
    href: "#priority-access",
  },
]

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-brand">
            <span className="footer-eyebrow">
              MN PREMIUM SERVICE
            </span>

            <h2>Every Detail Matters.</h2>

            <p>
              Premium car care focused on quality,
              trust and attention to every detail.
            </p>

            <a
              className="footer-booking-button"
              href="#booking"
            >
              BOOK YOUR APPOINTMENT
            </a>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>

            <nav
              className="footer-links"
              aria-label="Footer navigation"
            >
              {QUICK_LINKS.map((link) => (
                <a
                  href={link.href}
                  key={link.label}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-column">
            <h3>Business Hours</h3>

            <div className="footer-info-list">
              <p>
                <strong>Monday – Friday</strong>
                <span>10:00 AM – 6:00 PM</span>
              </p>

              <p>
                <strong>Service</strong>
                <span>By appointment only</span>
              </p>

              <p>
                <strong>Arrival</strong>
                <span>
                  Please arrive 10 minutes early
                </span>
              </p>
            </div>
          </div>

          <div className="footer-column">
            <h3>Contact</h3>

            <address className="footer-contact">
              <a href="tel:08032835986">
                080-3283-5986
              </a>

              <a href="mailto:mnpremiumservice@gmail.com">
                mnpremiumservice@gmail.com
              </a>

              <span>Okinawa, Japan</span>
            </address>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div>
            <p>
              © {currentYear} MN Premium Service.
              All rights reserved.
            </p>

            <p>
              Premium Auto Care • Okinawa, Japan
            </p>
          </div>

          <div className="footer-developed-by">
            <span>
              Website designed, developed &amp;
              maintained by
            </span>

            <strong>MN Digital Solutions</strong>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer