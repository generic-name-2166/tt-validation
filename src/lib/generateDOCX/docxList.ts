import * as docx from "docx";
import { generateSubheading } from "./docxTemplate";

function getListPoint(point: string): docx.Paragraph {
  return new docx.Paragraph({
    // Every TextRun here needs to end with a dot
    children: [new docx.TextRun(point)],
    spacing: { after: 18, before: 18 },
    bullet: { level: 0 },
  });
}

export function generateList(list: string[], label: string): docx.Paragraph[] {
  return [
    generateSubheading(label),
    ...list.filter((point) => point !== "").map(getListPoint),
  ];
}
