import AdminPage from "./features/admin/AdminPage"

import Hero from "./components/Hero"
import Services from "./components/Services"
import WhyChoose from "./components/WhyChoose"
import Booking from "./components/Booking"
import PriorityAccess from "./components/PriorityAccess"
import Loyalty from "./components/Loyalty"
import Reviews from "./components/Reviews"
import Footer from "./components/Footer"
import ConfirmBookingPage from "./pages/booking-confirm/ConfirmBookingPage"
import CancelBookingPage from "./pages/booking-confirm/CancelBookingPage"

import "./App.css"
import "./components/Hero.css"

function App() {
  const currentPath =
    window.location.pathname.replace(
      /\/+$/,
      "",
    ) || "/"

  const isAdminRoute =
    currentPath === "/admin" ||
    currentPath.startsWith("/admin/")

  const isBookingConfirmationRoute =
    currentPath.startsWith(
      "/booking/confirm/",
    )

  const isBookingCancellationRoute =
    currentPath.startsWith(
      "/booking/cancel/",
    )

  if (isAdminRoute) {
    return <AdminPage />
  }

  if (isBookingConfirmationRoute) {
    return <ConfirmBookingPage />
  }

  if (isBookingCancellationRoute) {
    return <CancelBookingPage />
  }

  return (
  <main>
    <Hero />
    <Services />
    <WhyChoose />
    <Booking />
    <PriorityAccess />
    <Loyalty />
    <Reviews />
    <Footer />
  </main>
)
}

export default App