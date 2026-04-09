import { useEffect, useState } from 'react';

/**
 * Custom hook that creates a typewriter effect for cycling through placeholder strings.
 * Also randomizes a hero title on mount.
 */
export function useTypewriter(placeholders: string[]) {
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = placeholders[currentIndex];

    if (isDeleting) {
      if (placeholderText.length > 0) {
        timer = setTimeout(() => {
          setPlaceholderText(currentFullText.substring(0, placeholderText.length - 1));
        }, 20);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
      }
    } else {
      if (placeholderText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setPlaceholderText(currentFullText.substring(0, placeholderText.length + 1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2500);
      }
    }
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, currentIndex, placeholders]);

  return placeholderText;
}

/**
 * Custom hook that picks a random title from an array on mount.
 */
export function useRandomTitle(titles: string[]) {
  const [title, setTitle] = useState(titles[0]);

  useEffect(() => {
    setTitle(titles[Math.floor(Math.random() * titles.length)]);
  }, []);

  return title;
}
