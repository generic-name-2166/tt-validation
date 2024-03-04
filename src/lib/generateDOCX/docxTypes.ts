interface MappedValue {
  key: string;
}

type TextValue = string | MappedValue;

interface SerializedTitle {
  inner: string;
}

interface SerializedLabel {
  inner: string;
}

interface SerializedText {
  inner: Array<TextValue>;
}

interface SerializedDefinition {
  word: string;
  definition: string;
}

interface SerializedCheckbox {
  checked: Array<string>;
}

interface SerializedTable {
  inner: Array<Array<string>>;
}

interface SerialziedSubsystem {
  // TODO
  inner: undefined;
}

type SerializedElement =
  | SerializedTitle
  | SerializedLabel
  | SerializedText
  | SerializedDefinition
  | SerializedCheckbox
  | SerializedTable
  | SerialziedSubsystem;
