import "./Services.css"

function Services() {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <section className="services-section" id="services">
      <div className="services-heading">
        <span>PREMIUM PACKAGES</span>

        <h2>Choose Your Package</h2>

        <p>
          Professional care designed for your vehicle.
        </p>
      </div>

      <div className="service-grid">
        <article className="service-card">
          <div className="service-card-header">
            <div className="service-symbol">
              <span aria-hidden="true">01</span>
            </div>

            <div>
              <span className="service-card-label">
                REGULAR CARE
              </span>

              <h3>Simple Wash</h3>
            </div>
          </div>

          <p className="service-summary">
            Perfect for regular vehicle maintenance.
          </p>

          <div className="service-duration">
            <span aria-hidden="true">◷</span>
            Estimated time: 1h30
          </div>

          <ul>
            <li>Exterior hand wash</li>
            <li>Window cleaning</li>
            <li>Interior vacuum</li>
            <li>Tire shine</li>
            <li>Body wax</li>
            <li>Visual Check</li>
          </ul>

          <div className="service-prices">
            <div>
              <span>Yellow Plate</span>
              <strong>$60</strong>
            </div>

            <div>
              <span>White Plate</span>
              <strong>$80</strong>
            </div>
          </div>

          <button
            type="button"
            className="service-button"
            onClick={scrollToBooking}
          >
            BOOK NOW
            <span aria-hidden="true">→</span>
          </button>
        </article>

        <article className="service-card service-card-featured">
          <div className="popular-badge">
            MOST COMPLETE
          </div>

          <div className="service-card-header">
            <div className="service-symbol service-symbol-premium">
              <span aria-hidden="true">02</span>
            </div>

            <div>
              <span className="service-card-label">
                PREMIUM CARE
              </span>

              <h3>Premium Detail</h3>
            </div>
          </div>

          <p className="service-summary">
            Complete care for a deeper, premium finish.
          </p>

          <div className="service-duration">
            <span aria-hidden="true">◷</span>
            Estimated time: 2h30
          </div>

          <ul>
            <li>Everything included in Simple Wash</li>
            <li>Steam cleaning</li>
            <li>Detailed interior cleaning</li>
            <li>Headlight restoration</li>
            <li>Interior ionization</li>
            <li>Premium finishing treatment</li>
          </ul>

          <div className="service-prices">
            <div>
              <span>Yellow Plate</span>
              <strong>$140</strong>
            </div>

            <div>
              <span>White Plate</span>
              <strong>$180</strong>
            </div>
          </div>

          <button
            type="button"
            className="service-button"
            onClick={scrollToBooking}
          >
            BOOK NOW
            <span aria-hidden="true">→</span>
          </button>
        </article>
      </div>
    </section>
  )
}

export default Services