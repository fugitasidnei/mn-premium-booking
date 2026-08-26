import "./Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__brand">
          <h2>MN Premium Service</h2>
          <p>Professional Care. Trusted Service.</p>
        </div>

        <div className="footer__contact">
          <span>Okinawa, Japan</span>
          <span>080-3283-5991</span>
        </div>
      </div>

      <div className="footer__bottom">
        <span>
          © 2026 MN Premium Service. All rights reserved.
        </span>

        <span>
          Created & maintained by MN Digital Solutions
        </span>
      </div>
    </footer>
  )
}