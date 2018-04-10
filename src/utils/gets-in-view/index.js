// @flow

/*:: type IOOptions = {|
  threshold?: Array<number>,
  root?: Element,
  rootMargin?: string,
|}; */

export default (
  element /*: Element */,
  { threshold = [1], root, rootMargin } /*: IOOptions */ = {},
) /*: Promise<void> */ =>
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
      { threshold, root, rootMargin },
    );
    io.observe(element);
  });
