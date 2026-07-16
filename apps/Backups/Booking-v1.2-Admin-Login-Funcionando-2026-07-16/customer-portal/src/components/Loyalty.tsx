import "./Loyalty.css"

function Loyalty() {
  return (
    <section className="loyalty-section" id="loyalty">
      <div className="loyalty-heading">
        <span>MN PREMIUM MEMBER</span>

        <h2>Loyalty Rewards Program</h2>

        <p>Every visit brings you closer to exclusive rewards.</p>
      </div>

      <div className="loyalty-grid">
        <article className="reward-card">
          <h3>After 6 Washes</h3>
          <strong>Earn 50% OFF</strong>
          <p>Your Next Wash</p>
        </article>

        <article className="reward-card reward-card-featured">
          <div className="reward-badge">BEST REWARD</div>
          <h3>After 12 Washes</h3>
          <strong>FREE</strong>
          <p>Simple Wash</p>
        </article>

        <article className="reward-card">
          <h3>Birthday Reward</h3>
          <strong>Earn 50% OFF</strong>
          <p>Your Next Wash</p>
        </article>

        <article className="reward-card">
          <h3>Refer a Friend</h3>
          <strong>Earn 50% OFF</strong>
          <p>Your Next Wash</p>
        </article>
      </div>

      <div className="loyalty-rules">
        <p>One 50% discount coupon may be used per visit.</p>
        <p>Birthday reward is valid during your birthday month.</p>
        <p>
          Referral reward is issued after the referred customer completes
          their first service.
        </p>
        <p>Loyalty rewards are non-transferable.</p>
      </div>
    </section>
  )
}

export default Loyalty