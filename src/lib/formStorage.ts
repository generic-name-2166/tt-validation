import { writable } from "svelte/store";

interface InputLayout {
    type: 'text' | 'textarea' | 'file' | 'checkbox' | 'table';
    amount?: number | [number, number];
}

interface ICell {
    label: string;
    title?: string;
    layout: InputLayout;
}

interface FormData {
    [id: string]: ICell;
}

export const formData = writable();
