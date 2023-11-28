import { writable } from "svelte/store";

export interface FormData {
  label: string;
  title?: string;
  dimensions: [number, number];
  data: string | string[][] | null;
  extra?: [string, string];
}

const temp: FormData[] = [];
export const formData = writable(temp);

const temp_: Map<string, string> = new Map();
temp_.set("documentTitle", "");
temp_.set("manager", "");
export const titleData = writable(new Map());

function storageAvailable(type: string) {
  let storage;
  try {
    // I don't even know what it wants from me here
    //@ts-expect-error
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

export function readFromLocalStorage(): FormData[] | null {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage no available");
    return null;
  }

  const item: string | null = localStorage.getItem("formData");

  if (!item) {
    return null;
  }

  return JSON.parse(item);
}

function setToLocalStorage(data: (FormData | null)[]): void {
  try {
    localStorage.setItem("formData", JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function saveCellToLocalStorage(
  cellData: FormData,
  cellNumber: number,
): void {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage no available");
    return;
  }

  const prevFormData: FormData[] | null = readFromLocalStorage();

  if (!prevFormData) {
    const mockList = new Array(cellNumber + 1);
    mockList[cellNumber] = cellData;

    setToLocalStorage(mockList);
    return;
  }

  const formDataList: FormData[] = prevFormData!;
  formDataList[cellNumber] = cellData;

  setToLocalStorage(formDataList);
}

export function saveAll(form_data: FormData[]): void {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage no available");
    return;
  }

  setToLocalStorage(form_data);
}
