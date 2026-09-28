import { useEffect } from 'react';

// Sets the browser tab title, e.g. "Courses | AcademiaConnect".
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | AcademiaConnect` : 'AcademiaConnect';
  }, [title]);
}
