import * as docx from "docx";

export function generateTitle(): docx.ISectionOptions {
  return {
    children: [
      new docx.Paragraph({
        heading: docx.HeadingLevel.TITLE,
        alignment: docx.AlignmentType.CENTER,
        children: [
          new docx.TextRun({
            text: "ТЕХНИЧЕСКОЕ ЗАДАНИЕ",
            allCaps: true,
            bold: true,
            font: "Times New Roman",
          }),
        ],
      }),
    ],
  };
}

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
