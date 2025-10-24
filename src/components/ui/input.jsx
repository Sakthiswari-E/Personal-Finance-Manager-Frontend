export function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 w-full ${className}`}
    />
  );
}
