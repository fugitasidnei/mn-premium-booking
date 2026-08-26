import AdminPage from "./features/admin/AdminPage"

import Hero from "./components/Hero"

import Services from "./components/Services"

import WhyChoose from "./components/WhyChoose"

import Booking from "./components/Booking"

import PriorityAccess from "./components/PriorityAccess"

import Loyalty from "./components/Loyalty"

import Reviews from "./components/Reviews"

import Location from "./components/Location"

import Footer from "./components/Footer"

import HomePage from "./pages/HomePage"

import HouseCleaningPage from "./pages/HouseCleaningPage"

import ConfirmBookingPage from "./pages/booking-confirm/ConfirmBookingPage"

import CancelBookingPage from "./pages/booking-confirm/CancelBookingPage"

import "./App.css"

import "./components/Hero.css"

function AutoCarePage() {
  return (
    <main>
      <Hero />

      <Services />

      <WhyChoose />

      <Booking />

      <PriorityAccess />

      <Loyalty />

      <Reviews />

      <Location />

      <Footer />
    </main>
  )
}

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
      "/confirm/",
    )

  const isBookingCancellationRoute =
    currentPath.startsWith(
      "/cancel/",
    )

  const isAutoCareRoute =
    currentPath === "/auto-care" ||
    currentPath.startsWith("/auto-care/")

  const isHouseCleaningRoute =
    currentPath === "/house-cleaning" ||
    currentPath.startsWith(
      "/house-cleaning/",
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

  if (isAutoCareRoute) {
    return <AutoCarePage />
  }

  if (isHouseCleaningRoute) {
    return <HouseCleaningPage />
  }

  return <HomePage />
}

export default App