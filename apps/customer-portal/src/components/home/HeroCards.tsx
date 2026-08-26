function HeroCards() {
  return (
    <div className="home-hero-service-cards">
      <article className="home-hero-service-card home-hero-cleaning-card">
        <span className="home-hero-card-label">
          House Cleaning
        </span>

        <h2>
          Professional care for your home
        </h2>

        <p>
          Residential cleaning performed with care,
          responsibility and attention to every detail.
        </p>

        <div className="home-hero-card-rating">
          <span aria-hidden="true">
            ★★★★★
          </span>

          <small>
            Personal and professional care
          </small>
        </div>

        <a
          className="home-hero-card-button"
          href="/house-cleaning"
        >
          View House Cleaning
          <span aria-hidden="true">
            →
          </span>
        </a>
      </article>

      <article className="home-hero-service-card home-hero-auto-card">
        <span className="home-hero-card-label">
          Premium Auto Care
        </span>

        <h2>
          Professional care for your vehicle
        </h2>

        <p>
          Premium washing and detailing with careful
          service and convenient online booking.
        </p>

        <div className="home-hero-card-rating">
          <span aria-hidden="true">
            ★★★★★
          </span>

          <small>
            Premium detailing services
          </small>
        </div>

        <a
          className="home-hero-card-button"
          href="/auto-care"
        >
          Book Your Appointment
          <span aria-hidden="true">
            →
          </span>
        </a>
      </article>
    </div>
  )
}

export default HeroCards