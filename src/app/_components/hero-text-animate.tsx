"use client";
import { useEffect, useState } from "react";

const Words = [
  ["ATS Friendly"],
  ["Revamp Old Resume"],
  ["LinkedIn Profile to Resume"],
  ["AI Powered"],
];

export function HeroTextAnimate() {
  const [currentArrayIndex, setCurrentArrayIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 250;
    const deleteSpeed = 100;
    const pauseBetweenWords = 1000;

    const type = () => {
      const currentArray = Words[currentArrayIndex];
      const currentWord = currentArray[currentWordIndex];

      if (isDeleting) {
        // Deleting text
        setCurrentText(currentWord.substring(0, currentText.length - 1));

        if (currentText === "") {
          setIsDeleting(false);
          // Move to next word or array
          if (currentWordIndex === currentArray.length - 1) {
            setCurrentArrayIndex((prev) => (prev + 1) % Words.length);
            setCurrentWordIndex(0);
          } else {
            setCurrentWordIndex((prev) => prev + 1);
          }
        }
      } else {
        // Typing text
        setCurrentText(currentWord.substring(0, currentText.length + 1));

        if (currentText === currentWord) {
          // Pause before starting to delete
          setTimeout(() => setIsDeleting(true), pauseBetweenWords);
          return;
        }
      }
    };

    const timer = setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentArrayIndex, currentWordIndex]);

  return (
    <div className="font-tobe flex flex-col items-center justify-center">
      <div className="flex items-center gap-1 text-7xl font-bold font-light">
        {currentText}
        <span className="-translate-y-1">|</span>
      </div>
    </div>
  );
}
