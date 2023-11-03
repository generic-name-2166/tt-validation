import { writable } from "svelte/store";

export interface FormData {
  label: string;
  dimensions: [number, number];
  data: string | string[][] | boolean[] | null;
}

const temp: FormData[] = [];
export const formData = writable(temp);
