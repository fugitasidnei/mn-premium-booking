import { useState } from "react"

import "./HouseCleaningPage.css"

import okinawaBackground from "../assets/okinawa-house-cleaning-bg.png"

const phoneNumber = "08032835986"

const whatsappMessage =
  "Hello, I would like to request information about MN Premium Service."

const whatsappUrl =
  `https://wa.me/81${phoneNumber.slice(1)}` +
  `?text=${encodeURIComponent(whatsappMessage)}`

type PricingBoard =
  | "house-cleaning"
  | "deployment"
  | null

function HouseCleaningPage() {
  const [openPricingBoard, setOpenPricingBoard] =
    useState<PricingBoard>(null)

  const togglePricingBoard = (
    board: Exclude<PricingBoard, null>,
  ) => {
    setOpenPricingBoard((currentBoard) =>
      currentBoard === board ? null : board,
    )
  }

  return (
    <main className="cleaning-page">
      <section
        className="cleaning-hero-shell"
        style={{
          backgroundImage: `url(${okinawaBackground})`,
        }}
        aria-label="MN Premium Service House Cleaning"
      >
        <nav
          className="cleaning-hero-hotspots"
          aria-label="House Cleaning navigation"
        >
          <a
            className="cleaning-hotspot cleaning-hotspot-services"
            href="#services"
            aria-label="Services"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-why"
            href="#why-us"
            aria-label="Why Us"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-process"
            href="#process"
            aria-label="How It Works"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-contact"
            href="#contact"
            aria-label="Contact"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-header-quote"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Request a Quote"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-main-quote"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Request a Cleaning Quote"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-phone"
            href={`tel:${phoneNumber}`}
            aria-label="Call 080-3283-5986"
          />

          <a
            className="cleaning-hotspot cleaning-hotspot-logo"
            href="/"
            aria-label="Return to MN Premium Service"
          />
        </nav>
      </section>

      <section
        className="cleaning-care-section"
        id="services"
      >
        <div className="cleaning-section-heading">
          <span>Care You Can Trust</span>

          <h2>
            Everything we do, handled
            with attention to every detail.
          </h2>

          <p>
            Your home deserves more than a cleaning service.
            It deserves care, respect and someone you can trust.
          </p>
        </div>

        <div className="cleaning-boards-grid">
          <article
            className={`cleaning-board ${
              openPricingBoard === "house-cleaning"
                ? "cleaning-board-open"
                : ""
            }`}
          >
            <div
              className="cleaning-board-clip"
              aria-hidden="true"
            >
              <span />
            </div>

            <div className="cleaning-board-paper">
              <div className="cleaning-board-heading">
                <span className="cleaning-board-kicker">
                  Home Care
                </span>

                <h3>
                  House Cleaning
                </h3>

                <p>
                  Professional cleaning focused on comfort,
                  organization and attention to detail.
                </p>
              </div>

              <div className="cleaning-board-checklist">
                <div><span>✓</span><p>Regular Home Cleaning</p></div>
                <div><span>✓</span><p>Deep Cleaning</p></div>
                <div><span>✓</span><p>PCS Cleaning</p></div>
                <div><span>✓</span><p>Kitchen &amp; Bathrooms</p></div>
                <div><span>✓</span><p>Bedrooms &amp; Bed Sheets</p></div>
                <div><span>✓</span><p>Laundry Room</p></div>
                <div><span>✓</span><p>Laundry &amp; Folding</p></div>
                <div><span>✓</span><p>Home Organization</p></div>
                <div><span>✓</span><p>Oven / Refrigerator / Pantry</p></div>
                <div><span>✓</span><p>Windows &amp; Tracks</p></div>
              </div>

              <button
                className="cleaning-board-toggle"
                type="button"
                onClick={() =>
                  togglePricingBoard("house-cleaning")
                }
                aria-expanded={
                  openPricingBoard === "house-cleaning"
                }
              >
                <span>
                  {openPricingBoard === "house-cleaning"
                    ? "Hide Services & Pricing"
                    : "View Services & Pricing"}
                </span>

                <strong aria-hidden="true">
                  {openPricingBoard === "house-cleaning"
                    ? "↑"
                    : "→"}
                </strong>
              </button>

              <div className="cleaning-board-pricing">
                <div className="cleaning-board-pricing-inner">
                  <div className="cleaning-board-price-heading">
                    <span>
                      Simple &amp; Transparent
                    </span>

                    <h4>
                      House Cleaning Pricing
                    </h4>
                  </div>

                  <div className="cleaning-board-price-list">
                    <div><span>Weekly Cleaning</span><strong>$100</strong></div>
                    <div><span>Bi-Weekly Cleaning</span><strong>$120</strong></div>
                    <div><span>Monthly Cleaning</span><strong>$140</strong></div>
                    <div><span>First Deep Cleaning</span><strong>$160</strong></div>
                    <div><span>PCS Cleaning</span><strong>$250</strong></div>
                    <div>
                      <span>
                        Wash &amp; Fold Laundry
                        <small>Up to 2 baskets</small>
                      </span>
                      <strong>$20</strong>
                    </div>
                  </div>

                  <div className="cleaning-board-addons">
                    <span>Add-ons</span>
                    <div><p>Inside Oven</p><strong>$20</strong></div>
                    <div><p>Inside Refrigerator</p><strong>$20</strong></div>
                    <div><p>Pantry</p><strong>$20</strong></div>
                    <div><p>Windows &amp; Tracks</p><strong>$40</strong></div>
                  </div>

                  <a
                    className="cleaning-board-whatsapp"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Talk to Mari
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </article>

          <article
            className={`cleaning-board cleaning-board-deployment ${
              openPricingBoard === "deployment"
                ? "cleaning-board-open"
                : ""
            }`}
          >
            <div
              className="cleaning-board-clip"
              aria-hidden="true"
            >
              <span />
            </div>

            <div className="cleaning-board-paper">
              <div className="cleaning-board-heading">
                <span className="cleaning-board-kicker">
                  Peace of Mind While You&apos;re Away
                </span>

                <h3>
                  Travel &amp; Deployment
                  <br />
                  Home Care
                </h3>

                <p>
                  Reliable property care while you travel
                  or are away on deployment.
                </p>
              </div>

              <div className="cleaning-board-checklist">
                <div><span>✓</span><p>Air Circulation</p></div>
                <div><span>✓</span><p>Plumbing / Water Check</p></div>
                <div><span>✓</span><p>Equipment Inspection</p></div>
                <div><span>✓</span><p>Leak Inspection</p></div>
                <div><span>✓</span><p>Vehicle Start-Up</p></div>
                <div><span>✓</span><p>Clothing &amp; Fabric Care</p></div>
                <div><span>✓</span><p>Mail Collection</p></div>
                <div><span>✓</span><p>Doors &amp; Windows Check</p></div>
                <div><span>✓</span><p>Property Inspection</p></div>
                <div><span>✓</span><p>Visit Report / Update</p></div>
              </div>

              <button
                className="cleaning-board-toggle"
                type="button"
                onClick={() =>
                  togglePricingBoard("deployment")
                }
                aria-expanded={
                  openPricingBoard === "deployment"
                }
              >
                <span>
                  {openPricingBoard === "deployment"
                    ? "Hide Services & Pricing"
                    : "View Services & Pricing"}
                </span>

                <strong aria-hidden="true">
                  {openPricingBoard === "deployment"
                    ? "↑"
                    : "→"}
                </strong>
              </button>

              <div className="cleaning-board-pricing">
                <div className="cleaning-board-pricing-inner">
                  <div className="cleaning-board-price-heading">
                    <span>
                      Peace of Mind Plans
                    </span>

                    <h4>
                      Travel &amp; Deployment Care
                    </h4>
                  </div>

                  <div className="cleaning-board-price-list">
                    <div><span>Once a Month</span><strong>$40</strong></div>
                    <div><span>Once a Week</span><strong>$100</strong></div>
                    <div><span>Twice a Week</span><strong>$180</strong></div>
                  </div>

                  <div className="cleaning-deployment-note">
                    <strong>
                      Protect your home from
                      Okinawa&apos;s humidity.
                    </strong>

                    <p>
                      Regular visits help keep air moving,
                      water circulating and your property
                      checked while you&apos;re away.
                    </p>
                  </div>

                  <a
                    className="cleaning-board-whatsapp"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ask About Home Care
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div className="cleaning-care-message">
          <span aria-hidden="true">♥</span>

          <div>
            <strong>
              More than cleaning. Care for your home.
            </strong>

            <p>
              Professional service with attention to detail,
              respect for your space and the quality your
              family deserves.
            </p>
          </div>
        </div>
      </section>

      <section
        className="cleaning-trust-section"
        id="why-us"
      >
        <div className="cleaning-trust-intro">
          <span>Why Families Trust MN</span>

          <h2>
            A service built around
            care, trust and quality.
          </h2>

          <p>
            We know inviting someone into your home is personal.
            That&apos;s why every visit is handled with respect,
            clear communication and attention to the details
            that make your home feel comfortable.
          </p>
        </div>

        <div className="cleaning-trust-grid">
          <article className="cleaning-trust-card">
            <span className="cleaning-trust-icon">✓</span>
            <div>
              <strong>Care You Can Feel</strong>
              <p>
                We treat your home with the same care and
                respect we would expect in our own.
              </p>
            </div>
          </article>

          <article className="cleaning-trust-card">
            <span className="cleaning-trust-icon">✦</span>
            <div>
              <strong>Attention to Every Detail</strong>
              <p>
                Consistent professional cleaning focused
                on the small details that make a difference.
              </p>
            </div>
          </article>

          <article className="cleaning-trust-card">
            <span className="cleaning-trust-icon">♥</span>
            <div>
              <strong>Respect for Your Space</strong>
              <p>
                Your home, belongings and privacy are always
                handled with responsibility and consideration.
              </p>
            </div>
          </article>

          <article className="cleaning-trust-card">
            <span className="cleaning-trust-icon">◷</span>
            <div>
              <strong>Reliable Local Service</strong>
              <p>
                Friendly Okinawa-based service with clear
                communication and dependable scheduling.
              </p>
            </div>
          </article>
        </div>

        <div className="cleaning-trust-promise">
          <div className="cleaning-trust-promise-mark">
            MN
          </div>

          <div>
            <span>Our Promise</span>
            <strong>
              Your satisfaction matters more than simply
              finishing the job.
            </strong>
            <p>
              We want every visit to leave you feeling
              comfortable, confident and happy with the care
              your home received.
            </p>
          </div>
        </div>
      </section>

      <section className="cleaning-humidity-section">
        <div className="cleaning-humidity-copy">
          <span className="cleaning-humidity-eyebrow">
            Travel &amp; Deployment Home Care
          </span>

          <h2>
            Your home cared for
            while you&apos;re away.
          </h2>

          <p>
            Okinawa&apos;s humidity can quickly affect a home
            that stays closed for long periods. Our visits help
            keep air moving, water circulating and important
            areas checked so you can travel or deploy with
            greater peace of mind.
          </p>

          <div className="cleaning-humidity-highlight">
            <strong>
              Protect your home from Okinawa&apos;s humidity.
            </strong>

            <span>
              Regular visits help reduce the risks caused by
              heat, moisture, stagnant air and an unattended home.
            </span>
          </div>

          <a
            className="cleaning-humidity-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Ask About Home Care
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="cleaning-humidity-services">
          <article>
            <span>01</span>
            <div>
              <strong>Air &amp; Humidity Care</strong>
              <p>
                Air circulation and visual humidity checks
                during every scheduled visit.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <strong>Water &amp; Plumbing</strong>
              <p>
                Run water, flush fixtures and check accessible
                areas for signs of leaks.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <strong>Home Security Check</strong>
              <p>
                Doors, windows and visible property conditions
                checked during each visit.
              </p>
            </div>
          </article>

          <article>
            <span>04</span>
            <div>
              <strong>Vehicle Start-Up</strong>
              <p>
                Vehicle start-up service when requested
                as part of your home care plan.
              </p>
            </div>
          </article>

          <article>
            <span>05</span>
            <div>
              <strong>Mail &amp; Property Care</strong>
              <p>
                Mail collection plus visual checks of equipment,
                clothing and fabric areas.
              </p>
            </div>
          </article>

          <article>
            <span>06</span>
            <div>
              <strong>Visit Report</strong>
              <p>
                A clear update after the visit so you know
                how your home is doing while you&apos;re away.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section
        className="cleaning-process-section"
        id="process"
      >
        <div className="cleaning-process-intro">
          <span>How It Works</span>

          <h2>
            Simple from the first message
            to the final check.
          </h2>

          <p>
            Clear communication, personalized care
            and no unnecessary complications.
          </p>
        </div>

        <div className="cleaning-process-grid">
          <article>
            <span>01</span>

            <div>
              <strong>Tell Us What You Need</strong>

              <p>
                Message Mari and tell us about your home,
                schedule and the type of care you need.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <strong>We Personalize the Service</strong>

              <p>
                We confirm the details and recommend
                the service that best fits your routine.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <strong>We Take Care of Your Home</strong>

              <p>
                Your service is completed with attention,
                respect and professional care.
              </p>
            </div>
          </article>

          <article>
            <span>04</span>

            <div>
              <strong>Final Check &amp; Peace of Mind</strong>

              <p>
                We make sure everything is handled so you
                can simply enjoy a cleaner, cared-for home.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="cleaning-testimonials-section">
        <div className="cleaning-compact-heading">
          <span>Trusted Home Care</span>
          <h2>Care that families can feel.</h2>
          <p>
            Our goal is simple: dependable service,
            respectful care and a home you feel good coming back to.
          </p>
        </div>

        <div className="cleaning-testimonials-grid">
          <article>
            <span className="cleaning-stars">★★★★★</span>
            <p>
              “Professional, careful and easy to communicate with.
              The house always feels fresh and cared for.”
            </p>
            <strong>MN Premium Service Customer</strong>
          </article>

          <article>
            <span className="cleaning-stars">★★★★★</span>
            <p>
              “Having someone check the home while we are away
              gives us real peace of mind in Okinawa.”
            </p>
            <strong>Travel &amp; Deployment Customer</strong>
          </article>

          <article>
            <span className="cleaning-stars">★★★★★</span>
            <p>
              “Friendly, reliable and attentive to the details.
              Exactly the kind of service we wanted.”
            </p>
            <strong>House Cleaning Customer</strong>
          </article>
        </div>
      </section>

      <section className="cleaning-faq-section">
        <div className="cleaning-compact-heading">
          <span>Frequently Asked Questions</span>
          <h2>Quick answers before you book.</h2>
        </div>

        <div className="cleaning-faq-grid">
          <details>
            <summary>Do I need to be home during the cleaning?</summary>
            <p>
              No. We can arrange the visit details with you in advance
              so the service fits your routine.
            </p>
          </details>

          <details>
            <summary>Can I request specific cleaning tasks?</summary>
            <p>
              Yes. Tell Mari what your home needs and we can personalize
              the service before confirming your appointment.
            </p>
          </details>

          <details>
            <summary>Do you provide PCS cleaning?</summary>
            <p>
              Yes. PCS cleaning is available and can be discussed based
              on the condition and needs of the property.
            </p>
          </details>

          <details>
            <summary>How does Travel &amp; Deployment Home Care work?</summary>
            <p>
              We schedule property visits while you are away and perform
              the agreed checks, care tasks and visit updates.
            </p>
          </details>
        </div>
      </section>

      <section
        className="cleaning-contact-section"
        id="contact"
      >
        <div className="cleaning-contact-copy">
          <span>We&apos;re Here to Help</span>

          <h2>
            Ready for a cleaner,
            better cared-for home?
          </h2>

          <p>
            Talk directly with Mari about house cleaning,
            PCS cleaning or Travel &amp; Deployment Home Care.
          </p>
        </div>

        <div className="cleaning-contact-actions">
          <a
            className="cleaning-contact-primary"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Talk to Mari
            <span aria-hidden="true">→</span>
          </a>

          <a
            className="cleaning-contact-secondary"
            href={`tel:${phoneNumber}`}
          >
            Call 080-3283-5986
          </a>
        </div>
      </section>

      <footer className="cleaning-footer">
        <div className="cleaning-footer-brand">
          <strong>MN Premium Service</strong>

          <span>
            House Cleaning · Travel &amp; Deployment Home Care
          </span>

          <small>
            Okinawa, Japan · © 2026 All rights reserved.
          </small>
        </div>

        <div className="cleaning-footer-links">
          <a href="#services">Services</a>
          <a href="#why-us">Why Us</a>
          <a href="#process">How It Works</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="cleaning-footer-credit">
          <span>
            Designed · Developed · Maintained by
          </span>

          <strong>MN Digital Solutions</strong>

          <small>
            Websites · CRM Systems · Digital Solutions
          </small>
        </div>
      </footer>
    </main>
  )
}

export default HouseCleaningPage