import "./Location.css"

const LOCATION_ADDRESS =
  "5-17-2 Teruya, Okinawa City, Okinawa 904-0011, Japan"

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=5-17-2+Teruya,+Okinawa+City,+Okinawa+904-0011,+Japan&output=embed"

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/?api=1&query=5-17-2+Teruya,+Okinawa+City,+Okinawa+904-0011,+Japan"

function Location() {
  return (
    <section
      className="location-section"
      aria-labelledby="location-title"
    >
      <div className="location-container">
        <div className="location-content">
          <span className="location-eyebrow">
            Our Location
          </span>

          <h2 id="location-title">
            Premium Auto Care in Okinawa City
          </h2>

          <p className="location-address">
            {LOCATION_ADDRESS}
          </p>

          <p className="location-notice">
            By appointment only. Please arrive 10 minutes
            before your scheduled appointment.
          </p>

          <a
            className="location-directions-button"
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions
          </a>
        </div>

        <div className="location-map">
          <iframe
            src={MAP_EMBED_URL}
            title="MN Premium Auto Care location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

export default Location