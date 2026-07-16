import "./Reviews.css"

function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-heading">
        <span>CUSTOMER REVIEWS</span>

        <h2>We’re Ready to Earn Your 5-Star Review</h2>

        <p>
          MN Premium Service is beginning this new car care journey in Okinawa
          with one goal: delivering careful work and excellent customer service.
        </p>
      </div>

      <div className="reviews-content">
        <div className="reviews-score">
          <div className="reviews-stars" aria-label="Five stars">
            ★★★★★
          </div>

          <strong>5-Star Service Standard</strong>

          <p>
            Real customer reviews will be added here as soon as our car wash
            services begin.
          </p>
        </div>

        <div className="reviews-promise">
          <h3>Our Promise</h3>

          <ul>
            <li>Honest service information</li>
            <li>Careful attention to every vehicle</li>
            <li>Clear communication before and after service</li>
            <li>Continuous improvement through customer feedback</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Reviews