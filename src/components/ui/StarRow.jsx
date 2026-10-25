export default function StarRow({ stars, max = 3, size = '1.6rem' }) {
  return (
    <span className="star-row" style={{ fontSize: size }} aria-label={`${stars}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'star on' : 'star'}>
          ★
        </span>
      ))}
    </span>
  )
}
