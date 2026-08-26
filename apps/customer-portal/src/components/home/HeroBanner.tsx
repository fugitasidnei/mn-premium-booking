import "./HeroBanner.css"

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <img
        src="/images/layout-pgn-inicial.png"
        alt="MN Premium Service"
        className="hero-banner-image"
      />

      <a
        href="/house-cleaning"
        className="hero-btn hero-btn-left"
        aria-label="House Cleaning"
      >
        House Cleaning
      </a>

      <a
        href="/auto-care"
        className="hero-btn hero-btn-right"
        aria-label="Book Auto Care"
      >
        Book Auto Care
      </a>
    </section>
  )
}