import * as docx from "docx";
import type { FormData } from "$lib/formStorage.ts";
import { generateTitle, generateHeading } from "./docxTemplate.ts";
import { generateTable } from "./docxTable.ts";
import { generateList } from "./docxList.ts";
import { generateText } from "./docxText.ts";

function addSection(cellData: FormData): docx.ISectionOptions {
  const children = !Array.isArray(cellData.data)
    ? generateText(cellData.data!, cellData.label, cellData.extra)
    : cellData.data.length === 1 || cellData.data[0].length === 1
      ? generateList(cellData.data.flat(2), cellData.label)
      : generateTable(cellData.data, cellData.label);

  if (cellData.title) {
    return {
      properties: { type: docx.SectionType.CONTINUOUS },
      children: [generateHeading(cellData.title), ...children],
    };
  }

  return {
    properties: {
      type: docx.SectionType.CONTINUOUS,
      page: {
        margin: { top: "25mm", left: "20mm", right: "10mm", bottom: "15mm" },
        pageNumbers: { start: 2 },
      },
    },
    children: children,
  };
  // I have no idea how am I supposed to do headers and page numbers at the top
}

function filterNoData(cellData: FormData): boolean {
  return !!cellData.data;
}

export async function generateDOCX(
  formData: FormData[],
  titleData: Map<string, string>,
): Promise<string> {
  const sections: docx.ISectionOptions[] = [
    // TODO this
    generateTitle(titleData),
    ...formData.filter(filterNoData).map(addSection),
  ];

  // It becomes readonly once passed to the document but TS doesn't know
  //@ts-expect-error
  sections[1]["properties"]!["type"] = docx.SectionType.NEXT_PAGE;

  const doc: docx.Document = new docx.Document({
    styles: {
      default: {
        document: {
          run: {
            size: "14pt",
            font: "Times New Roman",
          },
        },
      },
    },
    sections: sections,
  });

  const docBase64: string = await docx.Packer.toBase64String(doc);
  return (
    "data:/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
    docBase64
  );
}
