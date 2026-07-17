import "./StatCard.css"

type StatCardTone =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "yellow"
  | "cyan"
  | "red"

type StatCardProps = {
  title: string
  value: string
  subtitle?: string
  tone?: StatCardTone
}

function StatCard({
  title,
  value,
  subtitle,
  tone = "blue",
}: StatCardProps) {
  return (
    <article
      className={`stat-card stat-card--${tone}`}
    >
      <span className="stat-card__title">
        {title}
      </span>

      <strong className="stat-card__value">
        {value}
      </strong>

      {subtitle && (
        <span className="stat-card__subtitle">
          {subtitle}
        </span>
      )}
    </article>
  )
}

export default StatCard