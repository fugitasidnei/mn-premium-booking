import logo from "./assets/mn-logo.jpeg";
import exteriorImg from "./images/Exterior-Wash-Home.png";
import interiorImg from "./images/Interior-Detail-Home.png";
import finishImg from "./images/premim-finish.png";
import "./App.css";

function App() {
  return (
    <main>
      <img
        src={logo}
        alt="MN Premium Service"
        style={{ width: "320px" }}
      />

      <h2>Premium Auto Care</h2>

<p>Premium Car Detailing in Okinawa</p>
<button
  onClick={() =>
    document.getElementById("booking")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Book Your Appointment
</button>
      <p className="rating">
        ⭐⭐⭐⭐⭐ 5.0 Rating from Happy Customers
      </p>

      <section className="services">

        <div className="service-card">
          <img
            src={exteriorImg}
            alt="Exterior Wash"
            className="service-image"
          />

          <h3>Exterior Wash</h3>

          <p>Complete exterior hand wash.</p>
        </div>

        <div className="service-card">
          <img
            src={interiorImg}
            alt="Interior Detail"
            className="service-image"
          />

          <h3>Interior Detail</h3>

          <p>Vacuum and interior cleaning.</p>
        </div>

        <div className="service-card">
          <img
            src={finishImg}
            alt="Premium Finish"
            className="service-image"
          />

          <h3>Premium Finish</h3>

          <p>Professional shine and protection.</p>
        </div>

      </section>
    <section className="why-choose">
  <p className="section-label">
  WHY CHOOSE US
</p>

<h2>Experience the MN Premium Standard</h2>

<p className="section-intro">
  Professional detailing, premium products and meticulous attention to every
  vehicle we service.
</p>

  <div className="benefits">
    <div className="benefit-card">
      <span className="benefit-number">01</span>

<h3>By Appointment Only</h3>

<p>
  Every vehicle receives dedicated attention through scheduled appointments.
</p>
    </div>

    <div className="benefit-card">
     <span className="benefit-number">02</span>

<h3>Detail-Focused Service</h3>

<p>
  Every corner of your vehicle is cleaned with care, precision and attention
  to detail.
</p>
    </div>

    <div className="benefit-card">
      <span className="benefit-number">03</span>

<h3>Premium Products</h3>

<p>
  Professional-grade products that clean, protect and preserve your vehicle.
</p>
    </div>

    <div className="benefit-card">
      <span className="benefit-number">04</span>

<h3>Trusted Quality</h3>

<p>
  Consistent results, transparent service and premium workmanship every time.
</p>
    </div>
  </div>
</section>
   <section className="booking-section" id="booking">
  <p className="section-label">BOOK YOUR APPOINTMENT</p>

  <h2>Reserve Your Car Care</h2>

  <p className="booking-intro">
    Select your service and preferred appointment time. Please arrive
    10 minutes before your scheduled service.
  </p>

<form
  className="booking-form"
  onSubmit={(event) => {
    event.preventDefault()
  }}
>    <div className="form-group">
      <label htmlFor="service">Service</label>

      <select id="service" name="service">
        <option value="">Select a service</option>
        <option value="simple-wash">Simple Wash — 1h30</option>
        <option value="premium-detail">Premium Detail — 2h30</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="plateType">Plate Type</label>

      <select id="plateType" name="plateType">
        <option value="">Select plate type</option>
        <option value="yellow">Yellow Plate</option>
        <option value="white">White Plate</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="appointmentDate">Preferred Date</label>

      <input
        id="appointmentDate"
        name="appointmentDate"
        type="date"
      />
    </div>

    <div className="form-group">
      <label htmlFor="appointmentTime">Preferred Time</label>

      <select id="appointmentTime" name="appointmentTime">
        <option value="">Select a time</option>
        <option value="10:00">10:00 AM</option>
        <option value="11:30">11:30 AM</option>
        <option value="1:00">1:00 PM</option>
        <option value="2:30">2:30 PM</option>
        <option value="4:00">4:00 PM</option>
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="customerName">Full Name</label>

      <input
        id="customerName"
        name="customerName"
        type="text"
        placeholder="Your full name"
      />
    </div>

    <div className="form-group">
      <label htmlFor="phone">Phone Number</label>

      <input
        id="phone"
        name="phone"
        type="tel"
        placeholder="Your phone number"
      />
    </div>

    <div className="form-group form-group-full">
      <label htmlFor="email">Email</label>

      <input
        id="email"
        name="email"
        type="email"
        placeholder="Your email address"
      />
    </div>

    <div className="form-group form-group-full">
      <label htmlFor="notes">Special Requests</label>

      <textarea
        id="notes"
        name="notes"
        rows={4}
        placeholder="Tell us anything important about your vehicle"
      />
    </div>

    <div className="booking-notice form-group-full">
      <strong>By Appointment Only</strong>

      <span>
        Monday–Friday, 10:00 AM–6:00 PM. Public holidays open normally.
      </span>
    </div>

    <button className="booking-submit form-group-full" type="submit">
      Request Appointment
    </button>
  </form>
</section>
 </main>
  );
}

export default App;