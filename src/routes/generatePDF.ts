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
  return data.map((row) => ({ abbr: row[0], mean: row[1] }));
  /*
  return [
    { ["abbr"]: "gaming", ["mean"]: "data" },
    { abbr: "abbr", mean: "mean" },
  ];
  */
}

function writeText(
  doc: jsPDFtable,
  x: number,
  y: number,
  text: string,
  label: string,
  labelOnSameLine: boolean = true,
): [number, number] {
  const splitText: string[] = labelOnSameLine
    ? doc
        .splitTextToSize(`    ${label}`, 190)
        .concat(doc.splitTextToSize(`    ${text}`, 190))
    : doc.splitTextToSize(`    ${label} - ${text}`, 190);
  for (const row of splitText) {
    doc.text(row, x, y);
    y = shiftCoordinates(doc, y);
  }

  return [x, y];
}

function writeData(
  doc: jsPDFtable,
  x: number,
  y: number,
  label: string,
  data: string | string[][],
): [number, number] {
  if (!Array.isArray(data)) {
    return writeText(doc, x, y, data, label, true);
  }
  doc.text(label, x, y);
  y = shiftCoordinates(doc, y);

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

  const head: { [key: string]: string }[] = [
    { abbr: "Обозначение", mean: "Расшифровка" },
  ];
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
  const styles = {
    abbr: { font: "TimesCyr", cellWidth: 25 },
    mean: { font: "TimesCyr" },
  };
  const new_data = transformData(data);

  doc.autoTable({
    startY: y,
    body: new_data,
    head: head,
    columnStyles: styles,
    headStyles: {
      font: "TimesCyr",
      fontStyle: "bold",
      fillColor: "#ffffff",
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
