import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import type { FormData } from "../lib/formStorage.ts";
import "./TimesCyr-normal.js";
import "./TimesCyr-bold.js";
import "./TimesCyr-italic.js";
import "./TimesCyr-bolditalic.js";
applyPlugin(jsPDF);

interface jsPDFPlugin extends jsPDF {
  autoTable: Function;
  lastAutoTable: { finalY: number };
}

function shiftCoordinates(doc: jsPDF, y: number): number {
  if (y >= 297) {
    y = 10;
    doc.addPage();
  } else {
    y += 10;
  }
  return y;
}

function writeData(
  doc: jsPDFPlugin,
  x: number,
  y: number,
  label: string,
  data: string | string[][],
): [number, number] {
  doc.text(label, x, y);
  y = shiftCoordinates(doc, y);

  if (!Array.isArray(data)) {
    doc.text(doc.splitTextToSize(data, 190), x, y);
    y = shiftCoordinates(doc, y);

    return [x, y];
  }

  const head: Object = data.length === 2 ? { abbr: "Обозначение/сокращение", meaning: "Расшифровка" } : { list: "Список" };
  const columnStyles: { [key: string]: { font: string } } = {};
  for (const column of Object.keys(head)) {
    columnStyles[column] = { font: "TimesCyr" };
  }
  
  doc.autoTable({
    startY: y,
    body: data,
    head: head,
    columnStyles: columnStyles 
  });
  y = doc.lastAutoTable.finalY + 10;

  return [x, y];
}

function addCell(
  doc: jsPDFPlugin,
  x: number,
  y: number,
  cellData: FormData,
): [number, number] {
  if (!cellData.data) {
    return [x, y];
  }
  if (cellData.title) {
    doc.setFont("TimesCyr", "bold");
    doc.text(cellData.title, x, y);
    y = shiftCoordinates(doc, y);
    doc.setFont("TimesCyr", "normal");
  }

  [x, y] = writeData(doc, x, y, cellData.label, cellData.data);

  return [x, y];
}

export function generate_pdf(formData: FormData[]): string {
  const doc = new jsPDF() as jsPDFPlugin;
  doc.setFont("TimesCyr", "normal");
  let x: number = 10;
  let y: number = 10;

  for (const cellData of formData) {
    [x, y] = addCell(doc, x, y, cellData);
  }

  // doc.text("hello", x, y);
  return doc.output("datauristring");
}
