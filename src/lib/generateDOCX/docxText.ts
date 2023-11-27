import type * as docx from "docx";
import { generateSubheading, getGenericParagraph } from "./docxTemplate";

function applyExtra(text: string, extra: [string, string] | undefined): string {
  return extra ? extra[0] + text + extra[1] : text;
}

function isLabelOnTheSameLine(
  label_text: [string, string] | undefined,
): boolean {
  return !!label_text && label_text[0] === "label" && label_text[1] === "text";
}

export function generateText(
  text: string,
  label: string,
  extra: [string, string] | undefined,
): docx.Paragraph[] {
  return isLabelOnTheSameLine(extra)
    ? [getGenericParagraph(`${label} - ${text}`)]
    : [generateSubheading(label), getGenericParagraph(applyExtra(text, extra))];
}
