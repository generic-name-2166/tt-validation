/* import * as docx from "docx";
import {
  generateSubheading,
  getGenericParagraph,
  filterParagraphs,
} from "./docxTemplate";

function getListPoint(point: string): docx.Paragraph {
  return new docx.Paragraph({
    // Every TextRun here needs to end with a dot
    children: [new docx.TextRun(point)],
    spacing: { after: 18, before: 18 },
    bullet: { level: 0 },
  });
}

export function generateList(
  list: string[],
  label: string,
  extra: [string, string] | undefined,
): docx.Paragraph[] {
  // Filter takes care of the error
  //@ts-expect-error
  return [
    generateSubheading(label),
    getGenericParagraph(extra ? extra[0] : ""),
    ...list.filter((point) => point !== "").map(getListPoint),
    getGenericParagraph(extra ? extra[1] : ""),
  ].filter(filterParagraphs);
}
 */
