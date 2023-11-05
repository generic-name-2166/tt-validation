import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
import type { autoTable } from "jspdf-autotable";
import type { FormData } from "../lib/formStorage.ts";
import "./TimesCyr-normal.js";
import "./TimesCyr-bold.js";
import "./TimesCyr-italic.js";
import "./TimesCyr-bolditalic.js";
applyPlugin(jsPDF);

interface jsPDFtable extends jsPDF {
  autoTable: autoTable;
}

function shiftCoordinates(doc: jsPDFtable, y: number): number {
  if (y >= 297) {
    y = 10;
    doc.addPage();
  } else {
    y += 10;
  }
  return y;
}

function transformData(data: string[][]): { [key: string]: string }[] {
  return [
    { ["abbr"]: "gaming", ["mean"]: "data" },
    { abbr: "abbr", mean: "mean" },
  ];
}

function writeData(
  doc: jsPDFtable,
  x: number,
  y: number,
  label: string,
  data: string | string[][],
): [number, number] {
  doc.text(label, x, y);
  y = shiftCoordinates(doc, y);

  if (!Array.isArray(data)) {
    const splitText: string[] = doc.splitTextToSize(data, 190);
    for (const row of splitText) {
      doc.text(row, x, y);
      y = shiftCoordinates(doc, y);
    }

    return [x, y];
  }

  if (data.length === 1 || data[0].length === 1) {
    for (const cell of data.flat(2)) {
      const new_cell = cell.trim();
      if (!new_cell || new_cell === "") {
        continue;
      }

      const splitText: string[] = doc.splitTextToSize(`- ${new_cell}`, 190);

      for (const row of splitText) {
        doc.text(row, x, y);
        y = shiftCoordinates(doc, y);
      }
    }

    return [x, y];
  }

  const head: { [key: string]: string }[] = [{ abbr: "abbr", mean: "mean" }];
  /*
  const styles: { [key: string]: { font: string } }[] = head.map((column) => {
    const res = {};
    for (const name of Object.keys(column)) {
      //@ts-expect-error
      res[name] = { font: "TimesCyr" };
    }
    return res;
  });
  */
  const styles = { abbr: { font: "TimesCyr" }, mean: { font: "TimesCyr" } };
  const new_data = transformData(data);

  doc.autoTable({
    startY: y,
    body: new_data,
    head: head,
    columnStyles: styles,
    headStyles: {
      font: "TimesCry",
      fontStyle: "bold",
    },
  });
  //@ts-expect-error
  y = doc.lastAutoTable.finalY + 10;

  return [x, y];
}

function addCell(
  doc: jsPDFtable,
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
  const doc = new jsPDF() as jsPDFtable;
  doc.setFont("TimesCyr", "normal");
  let x: number = 10;
  let y: number = 10;

  for (const cellData of formData) {
    [x, y] = addCell(doc, x, y, cellData);
  }

  // doc.text("hello", x, y);
  return doc.output("datauristring");
}
