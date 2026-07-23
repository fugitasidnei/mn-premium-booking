import "./WhyChoose.css"

const BENEFITS = [
  {
    symbol: "★",
    title: "Premium Quality",
    description:
      "Professional care with attention to every detail.",
  },
  {
    symbol: "◷",
    title: "By Appointment",
    description:
      "Dedicated time reserved exclusively for your vehicle.",
  },
  {
    symbol: "✓",
    title: "Professional Products",
    description:
      "High-quality products selected for excellent results.",
  },
  {
    symbol: "◆",
    title: "Satisfaction Guaranteed",
    description:
      "Our goal is to deliver a service you can trust.",
  },
]

function WhyChoose() {
  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-heading">
          <span>WHY CHOOSE US</span>

          <h2>
            Why Choose MN Premium Service?
          </h2>

          <p>
            Reliable service, professional care and
            attention to every detail of your vehicle.
          </p>
        </div>

        <div className="why-grid">
          {BENEFITS.map((benefit) => (
            <article
              className="why-card"
              key={benefit.title}
            >
              <div className="why-icon">
                {benefit.symbol}
              </div>

              <div className="why-card-content">
                <h3>{benefit.title}</h3>

                <p>{benefit.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose