export type BookingDetailsTab =
  | "overview"
  | "history"
  | "loyalty"
  | "notes"
  | "timeline"

type BookingTabsProps = {
  activeTab: BookingDetailsTab
  onChange: (
    tab: BookingDetailsTab,
  ) => void
}

const TABS: Array<{
  id: BookingDetailsTab
  label: string
}> = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "history",
    label: "History",
  },
  {
    id: "loyalty",
    label: "Loyalty",
  },
  {
    id: "notes",
    label: "Notes",
  },
  {
    id: "timeline",
    label: "Timeline",
  },
]

function BookingTabs({
  activeTab,
  onChange,
}: BookingTabsProps) {
  return (
    <nav
      aria-label="Booking details sections"
      className="booking-details-tabs"
    >
      {TABS.map((tab) => (
        <button
          className={
            activeTab === tab.id
              ? "booking-details-tab booking-details-tab--active"
              : "booking-details-tab"
          }
          key={tab.id}
          type="button"
          onClick={() =>
            onChange(tab.id)
          }
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default BookingTabs