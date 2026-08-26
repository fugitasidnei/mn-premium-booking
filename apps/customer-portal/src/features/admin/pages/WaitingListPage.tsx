import {
  useMemo,
  useState,
} from "react"

import WaitingListFilters from "../waiting-list/components/WaitingListFilters"

import type {
  WaitingListSort,
  WaitingListStatusFilter,
} from "../waiting-list/components/WaitingListFilters"

import WaitingListTable from "../waiting-list/components/WaitingListTable"

import {
  useAdminWaitingList,
} from "../waiting-list/hooks/useAdminWaitingList"

function WaitingListPage() {
  const {
    entries,
    isLoading,
    error,
    refreshWaitingList,
  } = useAdminWaitingList()

  const [
    search,
    setSearch,
  ] = useState("")

  const [
    status,
    setStatus,
  ] = useState<WaitingListStatusFilter>(
    "all",
  )

  const [
    sort,
    setSort,
  ] = useState<WaitingListSort>(
    "newest",
  )

  const filteredEntries =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase()

      const matchingEntries =
        entries.filter((entry) => {
          const matchesSearch =
            normalizedSearch.length === 0 ||
            entry.full_name
              .toLowerCase()
              .includes(normalizedSearch) ||
            entry.phone
              .toLowerCase()
              .includes(normalizedSearch) ||
            entry.email
              .toLowerCase()
              .includes(normalizedSearch)

          const matchesStatus =
            status === "all" ||
            entry.status === status

          return (
            matchesSearch &&
            matchesStatus
          )
        })

      return [...matchingEntries].sort(
        (firstEntry, secondEntry) => {
          if (sort === "oldest") {
            return (
              new Date(
                firstEntry.created_at,
              ).getTime() -
              new Date(
                secondEntry.created_at,
              ).getTime()
            )
          }

          if (sort === "preferred_earliest") {
            return `${firstEntry.preferred_date}T${firstEntry.preferred_time}`
              .localeCompare(
                `${secondEntry.preferred_date}T${secondEntry.preferred_time}`,
              )
          }

          if (sort === "preferred_latest") {
            return `${secondEntry.preferred_date}T${secondEntry.preferred_time}`
              .localeCompare(
                `${firstEntry.preferred_date}T${firstEntry.preferred_time}`,
              )
          }

          return (
            new Date(
              secondEntry.created_at,
            ).getTime() -
            new Date(
              firstEntry.created_at,
            ).getTime()
          )
        },
      )
    }, [
      entries,
      search,
      status,
      sort,
    ])

  return (
    <div className="admin-waiting-list-page">
      <header className="admin-waiting-list-header">
        <div>
          <h1>Waiting List</h1>

          <p>
            Manage customers waiting for an available time.
          </p>
        </div>

        <div className="admin-waiting-list-count">
          <strong>
            {filteredEntries.length}
          </strong>

          <span>
            {filteredEntries.length === 1
              ? "request"
              : "requests"}
          </span>
        </div>
      </header>

      {isLoading ? (
        <div className="admin-waiting-list-state">
          <h2>Loading waiting list...</h2>

          <p>
            Please wait while the requests are loaded.
          </p>
        </div>
      ) : null}

      {!isLoading && error ? (
        <div
          className="admin-waiting-list-state admin-waiting-list-state--error"
          role="alert"
        >
          <h2>Unable to load waiting list</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => {
              void refreshWaitingList()
            }}
          >
            Try Again
          </button>
        </div>
      ) : null}

      {!isLoading && !error ? (
        <>
          <WaitingListFilters
            search={search}
            status={status}
            sort={sort}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onSortChange={setSort}
          />

          <WaitingListTable
            entries={filteredEntries}
          />
        </>
      ) : null}
    </div>
  )
}

export default WaitingListPage