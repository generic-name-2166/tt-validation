import * as docx from "docx";

const STANDARD_SPACING: number = 180;

export function generateHeading(title: string): docx.Paragraph {
  return new docx.Paragraph({
    heading: docx.HeadingLevel.HEADING_1,
    alignment: docx.AlignmentType.CENTER,
    spacing: { before: 300, after: STANDARD_SPACING },
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
    spacing: { before: 240, after: STANDARD_SPACING },
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
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    text: text,
  });
}

function getRightAlignedParagraph(text: string): docx.Paragraph {
  return new docx.Paragraph({
    spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
    alignment: docx.AlignmentType.RIGHT,
    children: [
      new docx.TextRun({
        text: text,
      }),
    ],
  });
}

export function generateTitle(
  titleData: Map<string, string>,
): docx.ISectionOptions {
  return {
    children: [
      getRightAlignedParagraph("Приложение № 1"),
      getRightAlignedParagraph("к Договору № _______________"),
      getRightAlignedParagraph("от __.__.202_"),
      new docx.Paragraph({
        alignment: docx.AlignmentType.RIGHT,
        spacing: { after: STANDARD_SPACING, before: 500 },
        children: [
          new docx.TextRun({
            text: "УТВЕРЖДАЮ",
            allCaps: true,
          }),
        ],
      }),
      // TODO handle missing values
      getRightAlignedParagraph(titleData.get("managerName")!),
      new docx.Paragraph({
        heading: docx.HeadingLevel.TITLE,
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: 300, before: 2000 },
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
        spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
        children: [
          new docx.TextRun({
            text: "на выполнение работ по теме:",
            bold: true,
          }),
        ],
      }),
      new docx.Paragraph({
        alignment: docx.AlignmentType.CENTER,
        spacing: { after: STANDARD_SPACING, before: STANDARD_SPACING },
        children: [
          new docx.TextRun({
            text: `"${titleData.get("documentTitle")!}"`,
            bold: true,
          }),
        ],
      }),
    ],
  };
}
