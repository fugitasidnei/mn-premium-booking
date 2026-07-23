import "./Reviews.css"

const SERVICE_PROMISES = [
  "Honest and transparent service information",
  "Careful attention to every vehicle",
  "Clear communication before and after service",
  "Continuous improvement through customer feedback",
]

function Reviews() {
  return (
    <section
      className="reviews-section"
      id="reviews"
    >
      <div className="reviews-container">
        <div className="reviews-heading">
          <span>CUSTOMER REVIEWS</span>

          <h2>
            We’re Ready to Earn Your
            5-Star Review
          </h2>

          <p>
            MN Premium Service is beginning
            this new car care journey in
            Okinawa with one clear goal:
            delivering careful work and
            excellent customer service.
          </p>
        </div>

        <div className="reviews-content">
          <article className="reviews-score">
            <div
              className="reviews-stars"
              aria-label="Five-star service"
            >
              ★★★★★
            </div>

            <strong>
              5-Star Service Standard
            </strong>

            <p>
              Real customer reviews will be
              displayed here as soon as our
              car wash services begin.
            </p>

            <div className="reviews-status">
              New service launching in Okinawa
            </div>
          </article>

          <article className="reviews-promise">
            <span className="reviews-promise-label">
              OUR COMMITMENT
            </span>

            <h3>Our Promise to Every Customer</h3>

            <ul>
              {SERVICE_PROMISES.map(
                (promise) => (
                  <li key={promise}>
                    <span
                      className="reviews-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>{promise}</span>
                  </li>
                ),
              )}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Reviews