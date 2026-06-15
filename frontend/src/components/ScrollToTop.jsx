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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Scroll any scrollable main layouts or container elements (for admin layout)
    const mainContainers = document.querySelectorAll('main, .overflow-y-auto');
    mainContainers.forEach((container) => {
      container.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
}
