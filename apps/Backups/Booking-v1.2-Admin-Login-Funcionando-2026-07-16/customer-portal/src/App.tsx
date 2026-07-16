import AdminPage from "./features/admin/AdminPage"
import Hero from "./components/Hero"
import Services from "./components/Services"
import WhyChoose from "./components/WhyChoose"
import Booking from "./components/Booking"
import PriorityAccess from "./components/PriorityAccess"
import Loyalty from "./components/Loyalty"
import Reviews from "./components/Reviews"
import "./App.css"

function App() {
  const isAdminRoute =
    window.location.pathname === "/admin"

  if (isAdminRoute) {
    return <AdminPage />
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
    </main>
  )
}

export default App