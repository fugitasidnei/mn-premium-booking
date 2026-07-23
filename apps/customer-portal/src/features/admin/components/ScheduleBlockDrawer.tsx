import {
  useEffect,
  useState,
} from "react"

import type {
  FormEvent,
} from "react"

import type {
  NewScheduleBlock,
  ScheduleBlockType,
} from "../../../types/scheduleBlock"

import "./ScheduleBlockDrawer.css"

interface ScheduleBlockDrawerProps {
  isOpen: boolean
  initialDate: string
  initialStartTime: string
  onClose: () => void
  onSave: (
    block: NewScheduleBlock,
  ) => Promise<void>
}

const blockTypeOptions: Array<{
  value: ScheduleBlockType
  label: string
}> = [
  {
    value: "lunch",
    label: "Lunch",
  },
  {
    value: "maintenance",
    label: "Maintenance",
  },
  {
    value: "personal",
    label: "Personal",
  },
  {
    value: "unavailable",
    label: "Unavailable",
  },
]

function addMinutesToTime(
  time: string,
  minutesToAdd: number,
): string {
  const [hours, minutes] =
    time.split(":").map(Number)

  const totalMinutes =
    hours * 60 +
    minutes +
    minutesToAdd

  const nextHours =
    Math.floor(
      totalMinutes / 60,
    )

  const nextMinutes =
    totalMinutes % 60

  return `${String(nextHours).padStart(
    2,
    "0",
  )}:${String(nextMinutes).padStart(
    2,
    "0",
  )}`
}

function ScheduleBlockDrawer({
  isOpen,
  initialDate,
  initialStartTime,
  onClose,
  onSave,
}: ScheduleBlockDrawerProps) {
  const [
    blockDate,
    setBlockDate,
  ] = useState(initialDate)

  const [
    startTime,
    setStartTime,
  ] = useState(initialStartTime)

  const [
    endTime,
    setEndTime,
  ] = useState(
    addMinutesToTime(
      initialStartTime,
      60,
    ),
  )

  const [
    title,
    setTitle,
  ] = useState("")

  const [
    reason,
    setReason,
  ] = useState("")

  const [
    blockType,
    setBlockType,
  ] =
    useState<ScheduleBlockType>(
      "unavailable",
    )

  const [
    isSaving,
    setIsSaving,
  ] = useState(false)

  const [
    formError,
    setFormError,
  ] = useState("")

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setBlockDate(initialDate)
    setStartTime(
      initialStartTime,
    )

    setEndTime(
      addMinutesToTime(
        initialStartTime,
        60,
      ),
    )

    setTitle("")
    setReason("")
    setBlockType(
      "unavailable",
    )
    setFormError("")
  }, [
    initialDate,
    initialStartTime,
    isOpen,
  ])

  function handleBlockTypeChange(
    nextType: ScheduleBlockType,
  ) {
    setBlockType(nextType)

    if (title.trim()) {
      return
    }

    switch (nextType) {
      case "lunch":
        setTitle("Lunch break")
        break

      case "maintenance":
        setTitle(
          "Equipment maintenance",
        )
        break

      case "personal":
        setTitle(
          "Personal appointment",
        )
        break

      default:
        setTitle("Unavailable")
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!blockDate) {
      setFormError(
        "Select a date.",
      )
      return
    }

    if (!startTime || !endTime) {
      setFormError(
        "Select the start and end time.",
      )
      return
    }

    if (
      endTime <= startTime
    ) {
      setFormError(
        "End time must be after start time.",
      )
      return
    }

    if (!title.trim()) {
      setFormError(
        "Enter a title.",
      )
      return
    }

    try {
      setIsSaving(true)
      setFormError("")

      await onSave({
        block_date:
          blockDate,
        start_time:
          startTime,
        end_time:
          endTime,
        title:
          title.trim(),
        reason:
          reason.trim(),
        block_type:
          blockType,
      })
    } catch {
      setFormError(
        "Unable to create schedule block.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="schedule-block-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Block schedule time"
    >
      <button
        className="schedule-block-drawer__backdrop"
        type="button"
        aria-label="Close schedule block drawer"
        onClick={onClose}
      />

      <aside className="schedule-block-drawer__panel">
        <header className="schedule-block-drawer__header">
          <div>
            <span>
              SCHEDULE
            </span>

            <h2>
              Block time
            </h2>

            <p>
              Reserve time for lunch,
              maintenance or personal
              commitments.
            </p>
          </div>

          <button
            className="schedule-block-drawer__close"
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form
          className="schedule-block-form"
          onSubmit={
            handleSubmit
          }
        >
          <div className="schedule-block-form__section">
            <h3>
              Block type
            </h3>

            <div className="schedule-block-form__types">
              {blockTypeOptions.map(
                (option) => (
                  <button
                    className={
                      blockType ===
                      option.value
                        ? "schedule-block-form__type schedule-block-form__type--active"
                        : "schedule-block-form__type"
                    }
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() => {
                      handleBlockTypeChange(
                        option.value,
                      )
                    }}
                  >
                    {option.label}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="schedule-block-form__section">
            <h3>
              Date and time
            </h3>

            <label>
              <span>
                Date
              </span>

              <input
                type="date"
                value={
                  blockDate
                }
                onChange={(
                  event,
                ) => {
                  setBlockDate(
                    event.target
                      .value,
                  )
                }}
              />
            </label>

            <div className="schedule-block-form__row">
              <label>
                <span>
                  Start time
                </span>

                <input
                  type="time"
                  step="1800"
                  value={
                    startTime
                  }
                  onChange={(
                    event,
                  ) => {
                    const nextTime =
                      event.target
                        .value

                    setStartTime(
                      nextTime,
                    )

                    setEndTime(
                      addMinutesToTime(
                        nextTime,
                        60,
                      ),
                    )
                  }}
                />
              </label>

              <label>
                <span>
                  End time
                </span>

                <input
                  type="time"
                  step="1800"
                  value={
                    endTime
                  }
                  onChange={(
                    event,
                  ) => {
                    setEndTime(
                      event.target
                        .value,
                    )
                  }}
                />
              </label>
            </div>
          </div>

          <div className="schedule-block-form__section">
            <h3>
              Details
            </h3>

            <label>
              <span>
                Title
              </span>

              <input
                type="text"
                value={title}
                placeholder="Example: Lunch break"
                maxLength={80}
                onChange={(
                  event,
                ) => {
                  setTitle(
                    event.target
                      .value,
                  )
                }}
              />
            </label>

            <label>
              <span>
                Notes
              </span>

              <textarea
                value={reason}
                placeholder="Optional notes"
                rows={4}
                maxLength={300}
                onChange={(
                  event,
                ) => {
                  setReason(
                    event.target
                      .value,
                  )
                }}
              />
            </label>
          </div>

          {formError && (
            <div className="schedule-block-form__error">
              {formError}
            </div>
          )}

          <footer className="schedule-block-form__footer">
            <button
              className="schedule-block-form__cancel"
              type="button"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="schedule-block-form__submit"
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Creating..."
                : "Create block"}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  )
}

export default ScheduleBlockDrawer