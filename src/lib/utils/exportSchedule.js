import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma español
import { FOOTER_PHRASES } from "./footerPhrases";
dayjs.locale("es"); // Configura el idioma globalmente
/* =========================
   CONSTANTES
========================= */
const COMPANY_NAME = "Variedades SantiDanna";
const logo = "/favicon.svg";

const COLORS = {
  headerBg: [249, 250, 251],
  tableHeader: [224, 231, 255], // azul clarito elegante
  rowAlt: [249, 250, 251],
  border: [226, 232, 240],
  accent: [99, 102, 241], // indigo soft
  textPrimary: [17, 24, 39],
  textSecondary: [107, 114, 128],
};

/* =========================
   HELPERS
========================= */
function buildTableData(schedules) {
  return schedules.map((s) => [
    s.ScheduleEmployee?.name || "-",
    s.is_rest_day ? "Descanso" : s.ScheduleShift?.name,
    s.areas.map((a) => a.name).join(", "),
    s.areas.map((a) => a.description).join(", "),
  ]);
}

function getRandomFooterPhrase() {
  return FOOTER_PHRASES[Math.floor(Math.random() * FOOTER_PHRASES.length)];
}
// Generar link directo al horario

const FOOTER_TEXT = "Gracias por su compromiso y dedicación diaria.";
/* =========================
   WHATSAPP TEXT BUILDER ✨
========================= */
export function buildWhatsappText({ date, schedules }) {
  const hour = dayjs().hour();
  const scheduleUrl = `https://variedadessantidanna.netlify.app/horario?date=${date}`;
  let greeting = "Hola";
  if (hour < 12) greeting = "Buenos días";
  else if (hour < 18) greeting = "Buenas tardes";
  else greeting = "Buenas noches";

  const footerPhrase = getRandomFooterPhrase();

  let text = "";
  text += `👋 *${greeting}*\n\n`;
  text += `*${COMPANY_NAME}*\n`;
  text += `*Horario del*\n`;
  text += `*${dayjs(date).format("dddd DD [de] MMMM YYYY")}*\n\n`;

  // Link al horario
  text += `🔗 Ver horario web: ${scheduleUrl}\n\n`;
  text += `_A continuación encontrarás la asignación del día:_\n\n`;

  schedules.forEach((s) => {
    const name = s.ScheduleEmployee?.name || "Sin nombre";

    const areaNames =
      s.areas?.length > 0
        ? s.areas.map((a) => a.name).join(", ")
        : "Sin asignar";

    const areaDescriptions =
      s.areas?.length > 0
        ? s.areas.map((a) => a.description || "Sin asignar").join(", ")
        : "Sin asignar";

    const turno = s.is_rest_day
      ? "*Descanso* 💤"
      : s.ScheduleShift?.name || "Sin turno";

    text += `*${name}*\n`;
    text += `Turno: *${turno}*\n`;
    text += `Área: *${areaNames}*\n`;
    text += `_${areaDescriptions}_\n\n`;
  });

  text += `✨ _${footerPhrase}_\n\n`;
  text += `🙏 *Gracias por su compromiso y excelente trabajo diario.*`;

  return text;
}

export async function copyWhatsappText({ date, schedules }) {
  const text = buildWhatsappText({ date, schedules });

  await navigator.clipboard.writeText(text);

  return text;
}
export async function shareSchedule(elementId, date) {
  const node = document.getElementById(elementId);
  if (!node) return;

  const dataUrl = await toPng(node, { backgroundColor: "#ffffff" });
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `horario-${date}.png`, { type: "image/png" });

  const text = `📅 Horario ${dayjs(date).format("dddd DD MMM YYYY")}`;

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], text });
    return;
  }

  // fallback: abrir WhatsApp con texto
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}
/* =========================
   PDF EXPORT (ELEGANTE)
========================= */
export function exportSchedulePDF({ date, schedules }) {
  const doc = new jsPDF("p", "mm", "a4");

  /* -------- HEADER -------- */
  doc.setFillColor(...COLORS.headerBg);
  doc.rect(0, 0, 210, 42, "F");

  doc.setFontSize(20);
  doc.setTextColor(...COLORS.textPrimary);
  doc.text(COMPANY_NAME, 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(...COLORS.textSecondary);
  doc.text(
    `Horario de Trabajo · ${dayjs(date).format("dddd DD MMM YYYY")}`,
    14,
    28
  );

  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(1);
  doc.line(14, 34, 80, 34);

  doc.addImage(logo, "SVG", 165, 8, 28, 26);

  /* -------- TABLE -------- */
  autoTable(doc, {
    startY: 50,
    head: [["Empleado", "Turno", "Áreas", "Descripción"]],
    body: buildTableData(schedules),
    theme: "grid",
    styles: {
      fontSize: 9.5,
      textColor: COLORS.textPrimary,
      cellPadding: 6,
      valign: "top",
      lineColor: COLORS.border,
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: COLORS.tableHeader,
      textColor: COLORS.textPrimary,
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: COLORS.rowAlt,
    },
    columnStyles: {
      0: { cellWidth: 36 },
      1: { cellWidth: 30 },
      2: { cellWidth: 42 },
      3: { cellWidth: "auto" },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: () => {
      doc.setDrawColor(...COLORS.border);
    },
  });

  /* -------- FOOTER -------- */
  const y = doc.lastAutoTable.finalY + 16;

  doc.setDrawColor(...COLORS.border);
  doc.line(14, y, 196, y);

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.textPrimary);
  doc.text(FOOTER_TEXT, 14, y + 8);

  doc.setFontSize(9);
  doc.setTextColor(...COLORS.textSecondary);
  doc.text(`“${getRandomFooterPhrase()}”`, 14, y + 14);

  doc.save(`horario-${date}.pdf`);
}

/* =========================
   PNG EXPORT (PRO CANVAS)
========================= */
export function exportSchedulePNG({ date, schedules }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const colWidths = [160, 110, 220, 260];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const padding = 14;
  const rowBase = 34;

  function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let offset = 0;

    words.forEach((word) => {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x, y + offset);
        line = word + " ";
        offset += lineHeight;
      } else {
        line = test;
      }
    });

    ctx.fillText(line, x, y + offset);
    return offset / lineHeight + 1;
  }

  ctx.font = "14px Inter, Arial";
  let tableHeight = rowBase;

  schedules.forEach((s) => {
    const row = [
      s.ScheduleEmployee?.name || "-",
      s.is_rest_day ? "Descanso" : s.ScheduleShift?.name,
      s.areas.map((a) => a.name).join(", "),
      s.areas.map((a) => a.description).join(", "),
    ];

    let max = 1;
    row.forEach((t, i) => {
      max = Math.max(
        max,
        Math.ceil(ctx.measureText(t).width / (colWidths[i] - 28))
      );
    });

    tableHeight += max * rowBase;
  });

  const headerHeight = 120;
  const footerHeight = 90;

  canvas.width = tableWidth;
  canvas.height = headerHeight + tableHeight + footerHeight;

  /* -------- BACKGROUND -------- */
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /* -------- HEADER -------- */
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(0, 0, canvas.width, headerHeight);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 28px Inter, Arial";
  ctx.fillText(COMPANY_NAME, 28, 46);

  ctx.font = "15px Inter, Arial";
  ctx.fillStyle = "#6b7280";
  ctx.fillText(
    `Horario de Trabajo · ${dayjs(date).format("dddd DD MMM YYYY")}`,
    28,
    76
  );

  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(28, 90);
  ctx.lineTo(120, 90);
  ctx.stroke();

  const logoImg = new Image();
  logoImg.src = logo;
  logoImg.onload = () => {
    ctx.drawImage(logoImg, canvas.width - 76, 28, 48, 48);
  };

  /* -------- TABLE HEADER -------- */
  let x = 0;
  let y = headerHeight;

  ctx.fillStyle = "#e0e7ff";
  ctx.fillRect(0, y, tableWidth, rowBase);

  ctx.fillStyle = "#111827";
  ctx.font = "bold 15px Inter, Arial";

  ["Empleado", "Turno", "Áreas", "Descripción"].forEach((h, i) => {
    ctx.fillText(h, x + padding, y + 22);
    x += colWidths[i];
  });

  ctx.strokeStyle = "#e5e7eb";
  ctx.strokeRect(0, y, tableWidth, rowBase);

  /* -------- ROWS -------- */
  ctx.font = "14px Inter, Arial";

  schedules.forEach((s, i) => {
    const row = [
      s.ScheduleEmployee?.name || "-",
      s.is_rest_day ? "Descanso" : s.ScheduleShift?.name,
      s.areas.map((a) => a.name).join(", "),
      s.areas.map((a) => a.description).join(", "),
    ];

    let maxLines = 1;
    row.forEach((t, j) => {
      maxLines = Math.max(
        maxLines,
        Math.ceil(ctx.measureText(t).width / (colWidths[j] - 28))
      );
    });

    const rowHeight = maxLines * rowBase;
    y += rowHeight;
    x = 0;

    if (i % 2 === 0) {
      ctx.fillStyle = "#f9fafb";
      ctx.fillRect(0, y - rowHeight, tableWidth, rowHeight);
    }

    ctx.strokeStyle = "#e5e7eb";
    ctx.strokeRect(0, y - rowHeight, tableWidth, rowHeight);

    ctx.fillStyle = "#111827";

    row.forEach((text, j) => {
      wrapText(text, x + padding, y - rowHeight + 24, colWidths[j] - 28, 20);
      x += colWidths[j];
    });
  });

  /* -------- FOOTER -------- */
  y += 34;
  ctx.strokeStyle = "#e5e7eb";
  ctx.beginPath();
  ctx.moveTo(28, y);
  ctx.lineTo(tableWidth - 28, y);
  ctx.stroke();

  ctx.fillStyle = "#374151";
  ctx.font = "14px Inter, Arial";
  ctx.fillText(FOOTER_TEXT, 28, y + 34);

  ctx.font = "italic 13px Inter, Arial";
  ctx.fillStyle = "#6b7280";
  ctx.fillText(`“${getRandomFooterPhrase()}”`, 28, y + 58);

  /* -------- DOWNLOAD -------- */
  const link = document.createElement("a");
  link.download = `horario-${date}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
