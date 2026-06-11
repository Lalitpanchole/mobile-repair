import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable default browser scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Scroll window/viewport to top (for public layouts / login)
    window.scrollTo(0, 0);

    // Scroll any scrollable main layouts or container elements (for admin layout)
    const mainContainers = document.querySelectorAll('main, .overflow-y-auto');
    mainContainers.forEach((container) => {
      container.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}
