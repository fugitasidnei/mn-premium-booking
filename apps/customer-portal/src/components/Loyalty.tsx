import "./Loyalty.css"

const REWARDS = [
  {
    title: "After 6 Washes",
    value: "50% OFF",
    description: "Your next wash",
  },
  {
    title: "After 12 Washes",
    value: "FREE",
    description: "Simple Wash",
    featured: true,
  },
  {
    title: "Birthday Reward",
    value: "50% OFF",
    description: "Your next wash",
  },
  {
    title: "Refer a Friend",
    value: "50% OFF",
    description: "Your next wash",
  },
]

const PROGRAM_RULES = [
  "One 50% discount coupon may be used per visit.",
  "Birthday reward is valid during your birthday month.",
  "Referral reward is issued after the referred customer completes their first service.",
  "Loyalty rewards are non-transferable.",
]

function Loyalty() {
  return (
    <section
      className="loyalty-section"
      id="loyalty"
    >
      <div className="loyalty-container">
        <div className="loyalty-heading">
          <span>MN PREMIUM MEMBER</span>

          <h2>Loyalty Rewards Program</h2>

          <p>
            Every visit brings you closer to
            exclusive rewards.
          </p>
        </div>

        <div className="loyalty-grid">
          {REWARDS.map((reward) => (
            <article
              className={`reward-card ${
                reward.featured
                  ? "reward-card-featured"
                  : ""
              }`}
              key={reward.title}
            >
              {reward.featured && (
                <div className="reward-badge">
                  BEST REWARD
                </div>
              )}

              <div
                className="reward-icon"
                aria-hidden="true"
              >
                {reward.featured ? "★" : "✓"}
              </div>

              <h3>{reward.title}</h3>

              <strong>{reward.value}</strong>

              <p>{reward.description}</p>
            </article>
          ))}
        </div>

        <div className="loyalty-rules">
          <div className="loyalty-rules-heading">
            <span aria-hidden="true">ⓘ</span>

            <strong>Program Rules</strong>
          </div>

          <div className="loyalty-rules-grid">
            {PROGRAM_RULES.map((rule) => (
              <p key={rule}>
                <span aria-hidden="true">✓</span>

                {rule}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Loyalty