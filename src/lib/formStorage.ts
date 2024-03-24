import { writable } from "svelte/store";
import type { MappedValue, TextValue } from "$lib/generateDOCX/docxTypes.ts";

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

function setToLocalStorage(data: SavedComponent[]): void {
  try {
    localStorage.setItem("formData", JSON.stringify(data));
  } catch (e) {
    console.error(e);
  }
}

export function saveAll(formData: SavedComponent[]): void {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage not available");
    return;
  }

  setToLocalStorage(formData);
}

export function readFromLocalStorage(): SavedComponent[] | null {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage not available");
    return null;
  }

  const item: string | null = localStorage.getItem("formData");
  return item ? JSON.parse(item) : null;
}

export interface SavedTitle {
  readonly identifier: "title";
  readonly inner: string;
  readonly notRender?: boolean;
}

export interface SavedLabel {
  readonly identifier: "label";
  readonly inner: string;
  readonly notRender?: boolean;
}

export interface SavedText {
  readonly identifier: "text";
  inner: string;
  implicit: MappedValue | "mappedOnly" | null;
}

export interface SavedImplicitText {
  readonly identifier: "implicitText";
  readonly inner: TextValue;
}

export interface SavedDefinition {
  readonly identifier: "definition";
  readonly word: string;
  // inner === definition
  inner: string;
}

/**
 * Array of [boolean, string]
 * where boolean signifies whether the line is checked
 * and string signifies value of the line
 */
export interface SavedCheckbox {
  readonly identifier: "checkbox";
  inner: [boolean, string][];
}

export interface SavedTable {
  readonly identifier: "table";
  inner: string[][];
}

export interface SavedSubsystem {
  readonly identifier: "subsystem";
  inner: {
    readonly name: SavedLabel;
    nameInput: SavedText;
    readonly description: SavedLabel;
    descInput: SavedText;
  }[];
}

export type SavedElement =
  | SavedTitle
  | SavedLabel
  | SavedText
  | SavedImplicitText
  | SavedDefinition
  | SavedCheckbox
  | SavedTable
  | SavedSubsystem;

export interface SavedComponent {
  inner: SavedElement[];
  saved: boolean;
}

export const formData = writable<SavedComponent[]>();

/**
 * Returns `inner` field of saved element
 *
 * # Side effects
 * Updates `formData` model if successful
 */
export function loadElement<T extends SavedElement>(
  componentId: number,
  elementId: number,
  identifier: T["identifier"],
): T["inner"] | null {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage not available");
    return null;
  }

  const item: string | null = localStorage.getItem("formData");

  if (!item) {
    return null;
  }

  const data: SavedElement | null | undefined =
    JSON.parse(item)[componentId].inner[elementId];

  if (!data) {
    return null;
  } else if (
    data.identifier !== identifier ||
    data.identifier === "title" ||
    data.identifier === "label"
  ) {
    console.error("Wrong data in storage", data?.identifier, identifier);
    return null;
  }

  formData.update((thisData: SavedComponent[]) => {
    const element: SavedElement = data;
    thisData[componentId].inner[elementId] = element;
    return thisData;
  });

  return data.inner;
}

/**
 * # Side effects
 *
 * Sets component saved status to true
 */
export function saveElement(
  element: SavedElement,
  componentId: number,
  elementId: number,
): void {
  if (!storageAvailable("localStorage")) {
    console.error("localStorage not available");
    return;
  }
  const data: SavedComponent[] | null = readFromLocalStorage();
  if (!data) {
    const mockList: SavedComponent[] = new Array(componentId + 1)
      .fill(null)
      .map((_null) => {
        return {
          inner: new Array(elementId + 1),
          saved: false,
        } satisfies SavedComponent;
      });
    mockList[componentId].inner[elementId] = element;
    setToLocalStorage(mockList);
    return;
  }
  data[componentId].inner[elementId] = element;
  if (!data[componentId].saved) {
    data[componentId].saved = true;
  }
  setToLocalStorage(data);
}

export function initStorage(formData: SavedComponent[]): void {
  const prevData: SavedComponent[] | null = readFromLocalStorage();
  if (!prevData) {
    saveAll(formData);
  }
}

export function clearStorage(dimensions: number[]): void {
  localStorage.clear();
  const clearData: SavedComponent[] = dimensions.map((len) => {
    return {
      inner: new Array(len),
      saved: false,
    } satisfies SavedComponent;
  });
  initStorage(clearData);
}

export const valueMap = writable(new Map<string, string>());
