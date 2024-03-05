export interface MappedValue {
  before: TextValue;
  key: string;
  after: TextValue;
}

export function mapValue(key: MappedValue, dict: Map<string, string>): string {
  const value: string | undefined = dict.get(key.key);
  const before: string = isMapped(key.before)
    ? mapValue(key.before, dict)
    : key.before;
  const after: string = isMapped(key.after)
    ? mapValue(key.after, dict)
    : key.after;
  if (!value) {
    // Can define default value here
    return before + after;
  }
  return before + value + after;
}

export type TextValue = string | MappedValue;

export function isMapped(value: TextValue): value is MappedValue {
  return (value as MappedValue).key !== undefined;
}

export interface SerializedTitle {
  indentifier: "title";
  inner: string;
}

export interface SerializedLabel {
  indentifier: "label";
  inner: string;
}

export interface SerializedText {
  identifier: "text";
  inner: TextValue;
}

export interface SerializedDefinition {
  identifier: "definition";
  word: string;
  definition: string;
}

export interface SerializedCheckbox {
  identifier: "checkbox";
  checked: Array<string>;
}

export interface SerializedTable {
  identifier: "table";
  inner: Array<Array<string>>;
}

export type SerializedElement =
  | SerializedTitle
  | SerializedLabel
  | SerializedText
  | SerializedDefinition
  | SerializedCheckbox
  | SerializedTable;
