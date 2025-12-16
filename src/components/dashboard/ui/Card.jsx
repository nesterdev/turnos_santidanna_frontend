export default function Card({ title, children }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-3 border border-gray-100">
      {title && (
        <h2 className="text-lg font-semibold text-gray-700 mb-1">{title}</h2>
      )}
      {children}
    </div>
  );
}
