import HeroAvatars from "./HeroAvatars"
import HeroCards from "./HeroCards"
import HeroFooter from "./HeroFooter"

function HeroSection() {
  return (
    <section className="home-hero">
      <div className="home-hero-background" />

      <div className="home-hero-overlay">
        <div className="home-hero-header">
          <img
            src="/images/logo.png"
            alt="MN Premium Service"
            className="home-hero-logo"
          />

          <h1>Premium Quality</h1>

          <p>
            Professional care for homes and vehicles.
          </p>
        </div>

        <HeroAvatars />

        <HeroCards />

        <HeroFooter />
      </div>
    </section>
  )
}

export default HeroSection