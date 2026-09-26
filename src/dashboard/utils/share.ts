export type SharePayload = {
  url: string;
  title: string;
  text?: string;
};

async function copyWithClipboardApi(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }

  await navigator.clipboard.writeText(value);
  return true;
}

async function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

export async function copyText(value: string) {
  if (!value) {
    return false;
  }

  try {
    if (await copyWithClipboardApi(value)) {
      return true;
    }
  } catch {
    return copyWithFallback(value);
  }

  return copyWithFallback(value);
}

export async function shareContent(payload: SharePayload) {
  if (!payload.url) {
    return false;
  }

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    await navigator.share(payload);
    return true;
  }

  return copyText(payload.url);
}
