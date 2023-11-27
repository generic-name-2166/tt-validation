import type { TitleData } from "$lib/formStorage";
import * as docx from "docx";

export function generateHeading(title: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_1,
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 30, after: 18 },
    children: [
      new docx.TextRun({
        text: title,
        bold: true,
        size: "18pt",
        font: "Times New Roman",
        color: "000000",
      }),
    ],
  });
}

export function generateSubheading(label: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_2,
    spacing: { before: 24, after: 18 },
    indent: { left: "1.25mm" },
    children: [
      new docx.TextRun({
        text: label,
        bold: true,
        size: "16pt",
        font: "Times New Roman",
        color: "000000",
      }),
    ],
  });
}

export function getGenericParagraph(text?: string | undefined): docx.Paragraph {
  return new docx.Paragraph({
    indent: { left: "1.25mm" },
    spacing: { after: 18, before: 18 },
    text: text,
  });
}

function getRightAlignedParagraph(text: string): docx.Paragraph {
  return new docx.Paragraph({
    spacing: { after: 18, before: 18 },
    alignment: docx.AlignmentType.RIGHT,
    children: [
      new docx.TextRun({
        text: text,
      }),
    ],
  });
}

export function generateTitle(titleData: TitleData): docx.ISectionOptions {
  return {
    children: [
      getRightAlignedParagraph("Приложение № 1"),
      getRightAlignedParagraph("к Договору № _______________"),
      getRightAlignedParagraph("от ______________ 202_"),
      new docx.Paragraph({
        alignment: docx.AlignmentType.RIGHT,
        spacing: { after: 18, before: 50 },
        children: [
          new docx.TextRun({
            text: "УТВЕРЖДАЮ",
            allCaps: true,
          }),
        ],
      }),
      getRightAlignedParagraph(titleData.manager),
      new docx.Paragraph({
        heading: docx.HeadingLevel.TITLE,
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 30, before: 200 },
        children: [
          new docx.TextRun({
            text: "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
            allCaps: true,
            bold: true,
            font: "Times New Roman",
            color: "000000",
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 18, before: 18 },
        children: [
          new docx.TextRun({
            text: "на выполнение работ по теме:",
            bold: true,
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 18, before: 18 },
        children: [
          new docx.TextRun({
            text: `"${titleData.documentTitle}"`,
            bold: true,
          }),
        ],
      }),
    ],
  };
}
