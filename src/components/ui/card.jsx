export function Card({ children, className = "" }) {
  return <div className={`rounded-xl bg-gray-800 p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold text-white">{children}</h2>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
