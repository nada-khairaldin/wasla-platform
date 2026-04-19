
export const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  id: string, 
  offset: number = 120,
  onComplete?: () => void 
) => {
  e.preventDefault();
  
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    window.history.replaceState(null, "", `#${id}`);
    
    if (onComplete) onComplete();
  }
};