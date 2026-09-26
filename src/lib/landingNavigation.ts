export function scrollToSection(target: string) {
  const id = target.replace(/^#/, "");
  const element = document.getElementById(id);

  if (!element) {
    return false;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  return true;
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
