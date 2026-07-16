import "./PriorityAccess.css"

function PriorityAccess() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <section className="priority-section" id="priority-access">
      <div className="priority-heading">
        <span>PRIORITY ACCESS</span>

        <h2>Be First in Line When a Spot Opens</h2>

        <p>
          No suitable appointment available? Join our Priority Access List and
          we will contact you when a cancellation creates an opening.
        </p>
      </div>

      <div className="priority-layout">
        <div className="priority-info">
          <strong>Priority Members Receive First Access</strong>

          <ul>
            <li>Free to join</li>
            <li>Requests are handled in the order received</li>
            <li>Fast notification when a spot opens</li>
            <li>Confirmation is required</li>
          </ul>

          <div className="priority-rule">
            You will have 30 minutes to confirm. If no confirmation is received,
            the appointment will be offered to the next customer.
          </div>
        </div>

        <form className="priority-form" onSubmit={handleSubmit}>
          <div className="priority-grid">
            <label>
              Full Name
              <input type="text" name="waitlistName" required />
            </label>

            <label>
              Phone Number
              <input type="tel" name="waitlistPhone" required />
            </label>

            <label>
              Email
              <input type="email" name="waitlistEmail" required />
            </label>

            <label>
              Vehicle
              <input
                type="text"
                name="waitlistVehicle"
                placeholder="Example: Toyota Aqua"
                required
              />
            </label>

            <label>
              Service
              <select name="waitlistService" required defaultValue="">
                <option value="" disabled>
                  Select a service
                </option>
                <option value="simple-wash">Simple Wash</option>
                <option value="premium-detail">Premium Detail</option>
              </select>
            </label>

            <label>
              Preferred Date
              <input type="date" name="waitlistDate" required />
            </label>

            <label>
              Preferred Time
              <select name="waitlistTime" required defaultValue="">
                <option value="" disabled>
                  Select a preference
                </option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="any-time">Any Time</option>
              </select>
            </label>

            <label>
              Plate Type
              <select name="waitlistPlate" required defaultValue="">
                <option value="" disabled>
                  Select plate type
                </option>
                <option value="yellow">Yellow Plate</option>
                <option value="white">White Plate</option>
              </select>
            </label>
          </div>

          <button type="submit" className="priority-button">
            JOIN PRIORITY ACCESS
          </button>
        </form>
      </div>
    </section>
  )
}

export default PriorityAccess