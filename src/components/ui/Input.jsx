export default function Input({ label, type = "text", value, onChange, name }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        className="border rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200"
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
