import { writable } from "svelte/store";

export interface FormData {
  label: string;
  title?: string;
  dimensions: [number, number];
  data: string | string[][] | null;
}

const temp: FormData[] = [];
export const formData = writable(temp);
