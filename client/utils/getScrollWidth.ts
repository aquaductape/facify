let scrollbarWidth: number | null = null;

const getScrollbarWidth = () => {
  if (scrollbarWidth !== null) return scrollbarWidth;

  const scrollDiv = document.createElement("div");
  scrollDiv.style.overflow = "scroll";
  document.body.appendChild(scrollDiv);

  // Get the scrollbar width
  scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Delete the DIV
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
};

export default getScrollbarWidth;
