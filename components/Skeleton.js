export default function Skeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skel-card" aria-label="Loading studio" />
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-label="Loading" />
    </div>
  );
}
