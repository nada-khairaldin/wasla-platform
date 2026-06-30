export {
  getTomorrowApiDateString,
  isApiDateString,
  parseLocalDate,
  toApiDateString,
  type ApiDateString,
} from "./date";

export const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  id: string,
  offset: number = 120,
  onComplete?: () => void,
) => {
  e.preventDefault();

  const element = document.getElementById(id);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `#${id}`);

    if (onComplete) onComplete();
  }
};

export const getInitials = (name: string) => {
    const parts = name?.trim().split(" ");
    if (parts?.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts?.[0][0]?.toUpperCase();
};
