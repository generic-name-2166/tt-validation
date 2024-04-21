/**
 * Takes an element and a function that mutates it. \
 * The order of actions is as follows \
 * User action --> `mutateTextContent` is called -->
 * observer instantiates --> `mutate` function is called -->
 * observer disconnects
 */
export function mutateTextContent(
  element: HTMLSpanElement,
  mutate: () => void,
  offset: number,
): void {
  const position: number | undefined = window
    .getSelection()
    ?.getRangeAt(0).startOffset;
  if (!position) {
    return;
  }

  const observer = new MutationObserver(() => {
    const range: Range = document.createRange();
    const selection: Selection | null = window.getSelection();
    range.setStart(element.firstChild!, position + offset);
    range.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(range);

    observer.disconnect();
  });
  observer.observe(element, { characterData: true, childList: true });

  mutate();
}
