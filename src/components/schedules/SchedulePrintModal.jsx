import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function SchedulePrintModal({ isOpen, onClose, schedules, filterDate }) {
  const [dailyValues, setDailyValues] = useState({});
  const [defaultRate, setDefaultRate] = useState("");
  const [companyInfo, setCompanyInfo] = useState({
    name: "NESTFAC S.A.S.",
    nit: "901.xxx.xxx-x",
    subtitle: "Acta de Control Diario y Soporte de Pago de Turnos",
    managerTitle: "Administrador / Encargado de Pagos"
  });

  useEffect(() => {
    if (isOpen && schedules?.length > 0) {
      const initial = {};
      schedules.forEach((s) => {
        const empId = s.ScheduleEmployee?.id;
        if (empId) initial[empId] = "";
      });
      setDailyValues(initial);
    }
  }, [isOpen, schedules]);

  if (!isOpen) return null;

  const applyDefaultRateToAll = () => {
    if (!defaultRate) return;
    const updated = {};
    schedules.forEach((s) => {
      const empId = s.ScheduleEmployee?.id;
      if (empId) updated[empId] = defaultRate;
    });
    setDailyValues(updated);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Por favor habilita las ventanas emergentes (pop-ups) para imprimir el acta.");
      return;
    }

    const formattedDate = dayjs(filterDate).format("DD/MM/YYYY");

    const rowsHtml = schedules.map((s, index) => {
      const empName = s.ScheduleEmployee?.name || "N/A";
      const shiftName = s.is_rest_day ? "Descanso" : (s.ScheduleShift?.name || "Sin turno");
      const isReplacement = s.is_replacement || s.was_replaced;
      const replacementText = isReplacement && s.OriginalEmployee ? `(Reemplaza a: ${s.OriginalEmployee.name})` : "";
      const paymentValue = dailyValues[s.ScheduleEmployee?.id] || "";
      const formattedPayment = paymentValue ? `$ ${Number(paymentValue).toLocaleString("es-CO")}` : "_________________";

      return `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-size: 10px;">${index + 1}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px;">
            <strong>${empName}</strong>
            ${replacementText ? `<br/><span style="font-size: 9px; color: #b45309;">${replacementText}</span>` : ""}
          </td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; text-align: center;">${shiftName}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; text-align: right; font-weight: bold;">${formattedPayment}</td>
          <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; height: 28px;"></td>
        </tr>
      `;
    }).join("");

    const minRows = 8;
    let emptyRowsHtml = "";
    if (schedules.length < minRows) {
      for (let i = schedules.length; i < minRows; i++) {
        emptyRowsHtml += `
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-size: 10px; color: transparent;">${i + 1}</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">&nbsp;</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">&nbsp;</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 8px;">&nbsp;</td>
            <td style="border: 1px solid #cbd5e1; padding: 6px 8px; height: 28px;">&nbsp;</td>
          </tr>
        `;
      }
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Acta Diaria de Pagos - ${formattedDate}</title>
          <style>
            @page { size: letter; margin: 1cm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111827; margin: 0; padding: 0; }
            .header { text-align: center; margin-bottom: 12px; border-bottom: 2px solid #111827; padding-bottom: 6px; }
            .header h1 { font-size: 14px; text-transform: uppercase; margin: 0 0 2px 0; font-weight: 800; }
            .header h2 { font-size: 11px; text-transform: uppercase; margin: 0 0 2px 0; font-weight: 600; color: #374151; }
            .header p { font-size: 10px; color: #4b5563; margin: 0; }
            .meta-info { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 10px; font-weight: 600; background: #f3f4f6; padding: 6px 10px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background-color: #e5e7eb; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10px; text-transform: uppercase; text-align: left; }
            .signatures { margin-top: 35px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .signature-box { width: 45%; text-align: center; border-top: 1px solid #111827; padding-top: 4px; font-size: 10px; font-weight: 600; color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${companyInfo.name}</h1>
            <h2>NIT: ${companyInfo.nit}</h2>
            <p>${companyInfo.subtitle}</p>
          </div>
          <div class="meta-info">
            <div>FECHA DE OPERACIÓN: ${formattedDate}</div>
            <div>TOTAL PERSONAL: ${schedules.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">#</th>
                <th>Empleado / Colaborador (Reemplazos)</th>
                <th style="text-align: center; width: 85px;">Turno</th>
                <th style="text-align: right; width: 105px;">Valor Día</th>
                <th style="text-align: center; width: 120px;">Firma de Recibido</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${emptyRowsHtml}
            </tbody>
          </table>
          <div class="signatures">
            <div class="signature-box">
              Firma del ${companyInfo.managerTitle}
            </div>
            <div class="signature-box">
              Vo.Bo. Gerencia / Dirección
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl max-h-[90vh] flex flex-col">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Configurar Acta de Pago Diaria</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingresa los montos individuales o masivos para estructurar el acta en formato tamaño carta.
          </p>
        </div>

        {/* DATOS DE EMPRESA */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Empresa:</label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              className="w-full px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-medium"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 mb-1">NIT:</label>
            <input
              type="text"
              value={companyInfo.nit}
              onChange={(e) => setCompanyInfo({ ...companyInfo, nit: e.target.value })}
              className="w-full px-2.5 py-1 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-medium"
            />
          </div>
        </div>

        {/* APLICAR VALOR GENERAL */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-gray-600 mb-1">Asignar valor general a todos:</label>
            <input
              type="number"
              placeholder="Ej: 45000"
              value={defaultRate}
              onChange={(e) => setDefaultRate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <button
            type="button"
            onClick={applyDefaultRateToAll}
            className="mt-5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition"
          >
            Aplicar
          </button>
        </div>

        {/* LISTA DE EMPLEADOS PARA VALORES INDIVIDUALES */}
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
          {schedules.map((s) => {
            const empId = s.ScheduleEmployee?.id;
            const empName = s.ScheduleEmployee?.name || "N/A";
            const isReplacement = s.is_replacement || s.was_replaced;
            return (
              <div key={s.id} className="flex items-center justify-between gap-3 p-2 bg-gray-50/50 border border-gray-100 rounded-xl">
                <div className="truncate">
                  <p className="text-xs font-semibold text-gray-900 truncate">{empName}</p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {s.is_rest_day ? "Descanso" : (s.ScheduleShift?.name || "Turno regular")}
                    {isReplacement && s.OriginalEmployee ? ` • Reemplaza a ${s.OriginalEmployee.name}` : ""}
                  </p>
                </div>
                <div className="w-32 flex-shrink-0">
                  <input
                    type="number"
                    placeholder="$ Valor día"
                    value={dailyValues[empId] || ""}
                    onChange={(e) => setDailyValues({ ...dailyValues, [empId]: e.target.value })}
                    className="w-full px-2.5 py-1 text-xs text-right bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 font-medium"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm flex items-center gap-2"
          >
            🖨️ Generar e Imprimir Acta
          </button>
        </div>
      </div>
    </div>
  );
}