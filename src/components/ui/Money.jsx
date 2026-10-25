// A Thai coin or banknote as a tappable button.
export default function Money({ item, onClick, small = false }) {
  return (
    <button
      type="button"
      className={`money money-${item.kind} ${small ? 'money-small' : ''}`}
      style={{ '--money': item.color, '--ring': item.ring ?? item.color }}
      onClick={onClick}
    >
      {item.value}
    </button>
  )
}
