import * as docx from "docx";
import type { FormData } from "$lib/formStorage.ts";

interface ISectionPart {
  children: docx.Paragraph[];
  properties?: { type: docx.SectionType };
}

function generateTitle(): ISectionPart {
  return {
    children: [
      new docx.Paragraph({
        heading: docx.HeadingLevel.TITLE,
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun("ТЕХНИЧЕСКОЕ ЗАДАНИЕ")],
      }),
    ],
  };
}

function generateHeading(title: string): docx.Paragraph {
  return new docx.Paragraph({
    children: [
      new docx.Paragraph({
        heading: docx.HeadingLevel.HEADING_1,
        alignment: docx.AlignmentType.CENTER,
        children: [new docx.TextRun(title)],
      }),
    ],
  });
}

function filterNoData(cellData: FormData): boolean {
  return !!cellData.data;
}

function addCell(cellData: FormData): docx.ISectionOptions {
  return {
    children: [],
  };
}

export async function generateDOCX(formData: FormData[]): Promise<string> {
  const sections = [
    generateTitle(),
    ...formData.filter(filterNoData).map(addCell),
  ];

  const doc: docx.Document = new docx.Document({
    sections: sections,
  });

  let docBase64: string = await docx.Packer.toBase64String(doc);
  return (
    "data:/application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
    docBase64
  );
}
