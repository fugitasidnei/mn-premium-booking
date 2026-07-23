import {
  useEffect,
  useState,
  type FormEvent,
} from "react"

import {
  AdminButton,
  AdminDrawer,
  AdminInput,
  AdminSelect,
} from "./layout/ui"

import {
  updateAdminBooking,
} from "../../../services/adminBookings"

import type {
  AdminBooking,
  BookingPlateType,
  BookingService,
  BookingStatus,
  UpdateAdminBooking,
} from "../../../types/adminBooking"

interface EditBookingDrawerProps {
  booking: AdminBooking | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => Promise<void>
}

interface BookingFormState {
  firstName: string
  lastName: string
  phone: string
  email: string
  vehicle: string
  model: string
  licensePlate: string
  service: BookingService
  plateType: BookingPlateType
  bookingDate: string
  bookingTime: string
  notes: string
  price: string
  status: BookingStatus
}

function getBookingPrice(
  service: BookingService,
  plateType: BookingPlateType,
): number {
  if (service === "premium") {
    return plateType === "yellow"
      ? 140
      : 180
  }

  return plateType === "yellow"
    ? 60
    : 80
}

const initialFormState: BookingFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  vehicle: "",
  model: "",
  licensePlate: "",
  service: "exterior",
  plateType: "yellow",
  bookingDate: "",
  bookingTime: "",
  notes: "",
  price: "",
  status: "pending",
}

function EditBookingDrawer({
  booking,
  isOpen,
  onClose,
  onSaved,
}: EditBookingDrawerProps) {
  const [form, setForm] =
    useState<BookingFormState>(
      initialFormState,
    )

  const [isSaving, setIsSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  useEffect(() => {
    if (!booking) {
      setForm(initialFormState)
      return
    }

    setForm({
      firstName: booking.first_name,
      lastName: booking.last_name,
      phone: booking.phone,
      email: booking.email,
      vehicle: booking.vehicle,
      model: booking.model,
      licensePlate: booking.license_plate,
      service: booking.service,
      plateType: booking.plate_type,
      bookingDate: booking.booking_date,
      bookingTime:
        booking.booking_time.slice(0, 5),
      notes: booking.notes ?? "",
      price: String(booking.price),
      status: booking.status,
    })

    setError("")
  }, [booking])

  function updateField<
    Key extends keyof BookingFormState,
  >(
    field: Key,
    value: BookingFormState[Key],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!booking) {
      return
    }

    const parsedPrice =
      Number(form.price)

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.vehicle.trim() ||
      !form.bookingDate ||
      !form.bookingTime
    ) {
      setError(
        "Please complete all required fields.",
      )

      return
    }

    if (
      Number.isNaN(parsedPrice) ||
      parsedPrice < 0
    ) {
      setError(
        "Please enter a valid price.",
      )

      return
    }

    const updates: UpdateAdminBooking = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      vehicle: form.vehicle.trim(),
      model: form.model.trim(),
      license_plate:
        form.licensePlate.trim(),
      service: form.service,
      plate_type: form.plateType,
      booking_date: form.bookingDate,
      booking_time: form.bookingTime,
      notes: form.notes.trim() || null,
      price: parsedPrice,
      status: form.status,
    }

    try {
      setIsSaving(true)
      setError("")

      await updateAdminBooking(
        booking.id,
        updates,
      )

      await onSaved()
      onClose()
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Could not save the booking."

      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminDrawer
      isOpen={isOpen}
      title="Edit Booking"
      onClose={onClose}
    >
      <form
        className="edit-booking-form"
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
      >
        {error && (
          <div className="edit-booking-form__error">
            {error}
          </div>
        )}

        <div className="edit-booking-form__grid">
          <AdminInput
            label="First Name"
            value={form.firstName}
            required
            onChange={(event) => {
              updateField(
                "firstName",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Last Name"
            value={form.lastName}
            required
            onChange={(event) => {
              updateField(
                "lastName",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Phone"
            value={form.phone}
            required
            onChange={(event) => {
              updateField(
                "phone",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(event) => {
              updateField(
                "email",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Vehicle"
            value={form.vehicle}
            required
            onChange={(event) => {
              updateField(
                "vehicle",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Model"
            value={form.model}
            onChange={(event) => {
              updateField(
                "model",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="License Plate"
            value={form.licensePlate}
            onChange={(event) => {
              updateField(
                "licensePlate",
                event.target.value,
              )
            }}
          />

          <AdminSelect
            label="Service"
            value={form.service}
            onChange={(event) => {
              const service =
                event.target
                  .value as BookingService

              setForm((currentForm) => ({
                ...currentForm,
                service,
                price: String(
                  getBookingPrice(
                    service,
                    currentForm.plateType,
                  ),
                ),
              }))
            }}
          >
            <option value="exterior">
              Exterior Wash
            </option>

            <option value="premium">
              Premium Finish
            </option>
          </AdminSelect>

          <AdminSelect
            label="Plate Type"
            value={form.plateType}
            onChange={(event) => {
              const plateType =
                event.target
                  .value as BookingPlateType

              setForm((currentForm) => ({
                ...currentForm,
                plateType,
                price: String(
                  getBookingPrice(
                    currentForm.service,
                    plateType,
                  ),
                ),
              }))
            }}
          >
            <option value="yellow">
              Yellow Plate
            </option>

            <option value="white">
              White Plate
            </option>
          </AdminSelect>

          <AdminInput
            label="Date"
            type="date"
            value={form.bookingDate}
            required
            onChange={(event) => {
              updateField(
                "bookingDate",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Time"
            type="time"
            value={form.bookingTime}
            required
            onChange={(event) => {
              updateField(
                "bookingTime",
                event.target.value,
              )
            }}
          />

          <AdminInput
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            required
            onChange={(event) => {
              updateField(
                "price",
                event.target.value,
              )
            }}
          />

          <AdminSelect
            label="Status"
            value={form.status}
            onChange={(event) => {
              updateField(
                "status",
                event.target
                  .value as BookingStatus,
              )
            }}
          >
            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </AdminSelect>
        </div>

        <label className="admin-field">
          <span className="admin-field__label">
            Notes
          </span>

          <textarea
            className="admin-textarea"
            rows={5}
            value={form.notes}
            onChange={(event) => {
              updateField(
                "notes",
                event.target.value,
              )
            }}
          />
        </label>

        <div className="edit-booking-form__actions">
          <AdminButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Close
          </AdminButton>

          <AdminButton
            type="submit"
            variant="primary"
            isLoading={isSaving}
          >
            Save Changes
          </AdminButton>
        </div>
      </form>
    </AdminDrawer>
  )
}

export default EditBookingDrawer