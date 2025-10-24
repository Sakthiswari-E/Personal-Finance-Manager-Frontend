export function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition bg-teal-500 hover:bg-teal-600 text-white ${className}`}
    >
      {children}
    </button>
  );
}