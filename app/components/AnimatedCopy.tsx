"use client";

import React, { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function AnimatedCopy({
  children,
  colorInitial = "#000000",
  colorAccent = "#ff00cc",
  colorFinal = "#dddddd",
}: {
  children: React.ReactNode;
  colorInitial: string;
  colorAccent: string;
  colorFinal: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef([]);
  const lastScrollProgress = useRef(0);
  const colorTransitionTimers = useRef(new Map());
  const completedChars = useRef(new Set());

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRefs.current = [];
      lastScrollProgress.current = 0;
      colorTransitionTimers.current.clear();
      completedChars.current.clear();

      //If only 1 element - means there's only a single children which will not ahve the 'data-copy-wrapper' attribute
      //If more than 1 element - data-copy-wrapper element will be present
      //This can be used to conditionally animate based on the number of blocks in the children
      let elements = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const wordSplit = SplitText.create(element, {
          type: "words",
          wordsClass: "word",
        });

        const charSplit = SplitText.create(wordSplit.words, {
          type: "chars",
          charsClass: "char",
        });

        splitRefs.current.push({ wordSplit, charSplit });
      });

      const allChars = splitRefs.current.flatMap(
        ({ charSplit }) => charSplit.chars
      );

      gsap.set(allChars, { color: colorInitial });

      const scheduleFinalTransition = (char, index) => {
        if (colorTransitionTimers.current.has(index)) {
          clearTimeout(colorTransitionTimers.current.get(index));
        }
        const timer = setTimeout(() => {
          if (!completedChars.current.has(index)) {
            gsap.to(char, {
              duration: 0.1,
              ease: "none",
              color: colorFinal,
              onComplete: () => {
                completedChars.current.add(index);
              },
            });
          }
          colorTransitionTimers.current.delete(index);
        }, 100);
        colorTransitionTimers.current.set(index, timer);
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 10%",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalChars = allChars.length;
          const isScrollingDown = progress >= lastScrollProgress.current;
          const currentCharIndex = Math.floor(progress * totalChars);

          allChars.forEach((char, index) => {
            if (!isScrollingDown && index >= currentCharIndex) {
              if (colorTransitionTimers.current.has(index)) {
                clearTimeout(colorTransitionTimers.current.get(index));
                colorTransitionTimers.current.delete(index);
              }

              completedChars.current.delete(index);
              gsap.set(char, { color: colorInitial });
              return;
            }

            //If the character is already animated, skip it to prevent over-animating and keep animation optimized
            if (completedChars.current.has(index)) {
              return;
            }


            //The character is in view and hasn't been animated, set the char to the colorAccent 
            if (index <= currentCharIndex) {
              gsap.set(char, {
                color: colorAccent,
              });
              if (!colorTransitionTimers.current.has(index)) {
                scheduleFinalTransition(char, index);
              } 
              //The character hasn't been reached in the scroll view yet
              else {
                gsap.set(char, {
                  color: colorInitial,
                });
              }
            }
          });
          lastScrollProgress.current = progress;
        },
      });

      //Cleanup when the component unmounts or the user navigates away
      return () => {
        colorTransitionTimers.current.forEach((timer) => clearTimeout(timer));
        colorTransitionTimers.current.clear();
        completedChars.current.clear();

        splitRefs.current.forEach(({wordSplit, charSplit}) => {
            if(charSplit) charSplit.revert();
            if(wordSplit) wordSplit.revert();
        })
      }
    },
    {
      scope: containerRef,
      dependencies: [colorInitial, colorAccent, colorFinal],
    }
  );

  //Handle both the cases:
  //1. When only a heading is passed down
  //2. When both a heading and paragraph content is passed down

  if (React.Children.count(children) === 1) {
    return <div ref={containerRef}>{children}</div>;
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
