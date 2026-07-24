export interface LoyaltyProgress {
  confirmedVisits: number
  completedCycles: number
  currentCycleVisits: number
  nextRewardAt: number
  visitsUntilReward: number
  rewardName: string
  progressPercentage: number
}

type BookingLoyaltyProps = {
  progress: LoyaltyProgress
}

function BookingLoyalty({
  progress,
}: BookingLoyaltyProps) {
  return (
    <section className="booking-details-section">
      <div className="booking-details-section__header">
        <div>
          <h3>Loyalty Program</h3>

          <p className="booking-loyalty__subtitle">
            Only confirmed bookings count
            toward rewards.
          </p>
        </div>

        <span>
          Cycle {progress.completedCycles + 1}
        </span>
      </div>

      <div className="booking-loyalty__summary">
        <div>
          <span>Current progress</span>

          <strong>
            {progress.currentCycleVisits}/12
          </strong>
        </div>

        <div>
          <span>Next reward</span>

          <strong>
            {progress.rewardName}
          </strong>

          <small>
            {progress.visitsUntilReward}{" "}
            {progress.visitsUntilReward === 1
              ? "visit"
              : "visits"}{" "}
            remaining
          </small>
        </div>
      </div>

      <div
        aria-label={`${progress.currentCycleVisits} of 12 confirmed visits`}
        className="booking-loyalty__progress"
      >
        <div
          className="booking-loyalty__progress-value"
          style={{
            width:
              `${progress.progressPercentage}%`,
          }}
        />
      </div>

      <div className="booking-loyalty__stamps">
        {Array.from(
          { length: 12 },
          (_, index) => {
            const visitNumber = index + 1

            const isCompleted =
              visitNumber <=
              progress.currentCycleVisits

            const isGift =
              visitNumber === 6

            const isFreeWash =
              visitNumber === 12

            return (
              <div
                className={[
                  "booking-loyalty__stamp",
                  isCompleted
                    ? "booking-loyalty__stamp--completed"
                    : "",
                  isGift
                    ? "booking-loyalty__stamp--gift"
                    : "",
                  isFreeWash
                    ? "booking-loyalty__stamp--free"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={visitNumber}
                title={
                  isGift
                    ? "Interior Air Freshener"
                    : isFreeWash
                      ? "Free Wash"
                      : `Visit ${visitNumber}`
                }
              >
                {isGift
                  ? "🎁"
                  : isFreeWash
                    ? "FREE"
                    : visitNumber}
              </div>
            )
          },
        )}
      </div>

      <div className="booking-loyalty__rewards">
        <div>
          <span>Visit 6</span>

          <strong>
            Interior Air Freshener
          </strong>
        </div>

        <div>
          <span>Visit 12</span>

          <strong>
            Free Wash
          </strong>
        </div>
      </div>

      {progress.completedCycles > 0 && (
        <div className="booking-loyalty__completed">
          <strong>
            {progress.completedCycles}
          </strong>

          <span>
            {progress.completedCycles === 1
              ? "completed loyalty cycle"
              : "completed loyalty cycles"}
          </span>
        </div>
      )}
    </section>
  )
}

export default BookingLoyalty