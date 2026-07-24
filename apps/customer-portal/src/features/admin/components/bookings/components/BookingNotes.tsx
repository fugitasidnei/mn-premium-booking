type BookingNotesProps = {
  notes: string | null
}

function BookingNotes({
  notes,
}: BookingNotesProps) {
  return (
    <section className="booking-details-section">
      <div className="booking-details-section__header">
        <h3>Booking Notes</h3>
      </div>

      <div className="booking-details-notes">
        {notes?.trim() ? (
          <p>{notes}</p>
        ) : (
          <p className="booking-details-notes__empty">
            No notes were added to this
            booking.
          </p>
        )}
      </div>
    </section>
  )
}

export default BookingNotes