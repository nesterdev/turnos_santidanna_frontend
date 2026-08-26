import CustomDatePicker from "../ui/CustomDatePicker";

export default function AutomaticMode({ autoData, setAutoData, shifts }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Cantidad de empleados por turno
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAutoData((p) => ({ ...p, capacity: Math.max(1, p.capacity - 1) }))}
            className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-lg transition"
          >
            −
          </button>
          <input
            type="number"
            value={autoData.capacity}
            onChange={(e) => setAutoData({ ...autoData, capacity: e.target.value })}
            className="w-20 text-center text-sm font-bold bg-gray-50 border border-gray-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-[#FF3131]/20 focus:border-[#FF3131]"
          />
          <button
            type="button"
            onClick={() => setAutoData((p) => ({ ...p, capacity: Number(p.capacity) + 1 }))}
            className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center font-bold text-lg transition"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <CustomDatePicker
          label="Fecha inicio:"
          value={autoData.start_date}
          onChange={(val) => setAutoData((p) => ({ ...p, start_date: val }))}
        />
        <CustomDatePicker
          label="Fecha fin:"
          value={autoData.end_date}
          onChange={(val) => setAutoData((p) => ({ ...p, end_date: val }))}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Turno
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {shifts.map((s) => (
            <div
              key={s.id}
              onClick={() => setAutoData({ ...autoData, shift_id: s.id })}
              className={`card-option transition-all cursor-pointer ${
                autoData.shift_id === s.id ? "card-option-active border-[#FF3131]" : ""
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.start_time} – {s.end_time}</p>
              </div>
              <input type="radio" checked={autoData.shift_id === s.id} readOnly className="accent-[#FF3131]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}