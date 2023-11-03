import { writable } from "svelte/store";

interface IInputLayout {
  type: "text" | "textarea" | "file" | "date";
}

export interface SubsystemsLayout {
  type: "subsystems";
  amount: [number, number];
}

export interface CheckboxLayout {
  type: "checkbox";
  amount: number;
  labels: string[];
}

export interface TableLayout {
  type: "table";
  amount: [number, number];
}

export type InputLayout =
  | CheckboxLayout
  | TableLayout
  | IInputLayout
  | SubsystemsLayout;

interface ICell {
  label: string;
  title?: string;
  layout: InputLayout;
}

export const formData = writable([]);
