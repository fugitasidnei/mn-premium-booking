import "./WaitingListFilters.css"
import type {
  WaitingListStatus,
} from "../types/waitingList"

export type WaitingListStatusFilter =
  | "all"
  | WaitingListStatus

export type WaitingListSort =
  | "newest"
  | "oldest"
  | "preferred_earliest"
  | "preferred_latest"

interface WaitingListFiltersProps {
  search: string
  status: WaitingListStatusFilter
  sort: WaitingListSort
  onSearchChange: (value: string) => void
  onStatusChange: (
    value: WaitingListStatusFilter,
  ) => void
  onSortChange: (
    value: WaitingListSort,
  ) => void
}

function WaitingListFilters({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: WaitingListFiltersProps) {
  return (
    <div className="waiting-list-filters">
      <label className="waiting-list-filter-search">
        <span>Search customers</span>

        <input
          type="search"
          value={search}
          placeholder="Name, phone or email"
          onChange={(event) => {
            onSearchChange(
              event.target.value,
            )
          }}
        />
      </label>

      <label className="waiting-list-filter-field">
        <span>Status</span>

        <select
          value={status}
          onChange={(event) => {
            onStatusChange(
              event.target
                .value as WaitingListStatusFilter,
            )
          }}
        >
          <option value="all">
            All statuses
          </option>

          <option value="waiting">
            Waiting
          </option>

          <option value="contacted">
            Contacted
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="cancelled">
            Cancelled
          </option>
        </select>
      </label>

      <label className="waiting-list-filter-field">
        <span>Sort by</span>

        <select
          value={sort}
          onChange={(event) => {
            onSortChange(
              event.target
                .value as WaitingListSort,
            )
          }}
        >
          <option value="newest">
            Newest requests
          </option>

          <option value="oldest">
            Oldest requests
          </option>

          <option value="preferred_earliest">
            Preferred date: earliest
          </option>

          <option value="preferred_latest">
            Preferred date: latest
          </option>
        </select>
      </label>
    </div>
  )
}

export default WaitingListFilters