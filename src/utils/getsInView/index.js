export default (element, { threshold = [1], ...restOfOptions } = {}) =>
  new Promise((resolve, reject) => {
    if (!element) reject();
    if (!('IntersectionObserver' in window)) return resolve();
    const io = new window.IntersectionObserver(
      entries => {
        for (const { isIntersecting, target } of entries) {
          if (target !== element) continue;
          if (isIntersecting) {
            io.unobserve(element);
            return resolve();
          }
        }
      },
      { ...restOfOptions, threshold },
    );
    io.observe(element);
  });
