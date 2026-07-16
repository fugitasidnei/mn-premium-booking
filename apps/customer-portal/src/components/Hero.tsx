import carWashAvatar from "../assets/car-wash-avatar.png"
import mnCrestLogo from "../assets/mn-crest-logo.png"
function Hero() {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({
      behavior: "smooth",
    })
  }

  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <p className="hero-kicker">PREMIUM AUTO CARE IN OKINAWA</p>

        <h1>
          Every Detail
          <span>Matters.</span>
        </h1>

        <p className="hero-description">
          Professional car care with premium products, careful workmanship and
          personalized service for every vehicle.
        </p>

        <div className="hero-actions">
          <button className="primary-button" onClick={scrollToBooking}>
            Book Your Appointment
          </button>

          <button className="secondary-button" onClick={scrollToServices}>
            Our Services
          </button>
        </div>

        <div className="hero-highlights">
          <div>
            <strong>By Appointment</strong>
            <span>Personalized service</span>
          </div>

          <div>
            <strong>Premium Quality</strong>
            <span>Professional products</span>
          </div>

          <div>
            <strong>Okinawa-city</strong>
            <span>Local car care</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-speech">
          <p className="speech-title">Hi! I'm Sidnei.</p>

          <p className="speech-text">
            I'll personally take care of your vehicle with attention to every
            detail, premium products and the dedication your car deserves.
          </p>

          <p className="speech-invite">
            I look forward to welcoming you and giving you a premium car care
            experience.
          </p>

          <strong className="speech-footer">
            Your car is in good hands.
          </strong>
        </div>

        <div className="hero-badge">
  <img
    src={mnCrestLogo}
    alt="MN Premium Service"
    className="hero-badge-logo"
  />
</div>

        <div className="hero-image-placeholder">
          <img
            src={carWashAvatar}
            alt="MN Premium Service Car Wash Specialist"
            className="hero-avatar"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero