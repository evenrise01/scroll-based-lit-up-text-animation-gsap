"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReactLenis from "lenis/react";
import type { LenisRef } from "lenis/react";

export default function Home() {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);

    return () => gsap.ticker.remove(update);
  }, []);
  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <section className="hero">
        <img src="/hero-img.jpg" alt="Intro Hero Image" />
      </section>
      <section className="about">
        <div className="header">
          <h1>A new chapter in modern design.</h1>
        </div>
        <div className="copy">
          <p>
            In an age where design defines perception, Evenrise Studios shapes
            the intersection of clarity and creativity. Every detail is crafted
            with intention, every experience built to elevate. This is more than
            design—it is the quiet force behind progress, blending form and
            function into visual harmony. At Evenrise, we don’t just build
            brands; we help them rise, evenly and endlessly.
          </p>
        </div>
      </section>
      <section className="banner-img">
        <img src="img-1.jpg" alt="banner" />
      </section>
      <section className="services">
        <div className="service">
          <div className="col">
            <div className="service-copy">
              <h3>Precision Design</h3>
              <p>
                Every breakthrough begins with intention. From the first sketch
                to the final launch, our design process is grounded in balance,
                clarity, and purpose. What you see isn’t just an interface—it’s
                the result of countless deliberate choices, each crafted to
                align beauty with function. Every pixel, every motion, is
                designed to set new standards in digital elegance.
              </p>
            </div>
          </div>
          <div className="col">
            <img src="/img-2.jpg" alt="" />
          </div>
        </div>
        <div className="service">
          <div className="col">
            <img src="/img-3.jpg" alt="" />
          </div>
          <div className="col">
            <div className="service-copy">
              <h3>Creative Direction</h3>
              <p>
                Every story begins with vision. At Evenrise, we translate
                abstract ideas into clear creative direction—guiding form, tone,
                and emotion with purpose. Our process finds beauty in restraint
                and strength in simplicity, crafting narratives that resonate
                across every medium. We don’t just shape visuals; we build
                meaning that endures.
              </p>
            </div>
          </div>
        </div>
        <div className="service">
          <div className="col">
            <div className="service-copy">
              <h3>Web Development</h3>
              <p>
                Design comes alive through motion and precision. From seamless
                interactions to scalable architecture, our development process
                ensures performance that feels effortless. Each line of code
                reflects the same discipline as our design—minimal, refined, and
                intentional. The result: experiences that move as smoothly as
                they inspire.
              </p>
            </div>
          </div>
          <div className="col">
            <img src="/img-4.jpg" alt="" />
          </div>
        </div>
        <div className="service">
          <div className="col">
            <img src="/img-5.jpg" alt="" />
          </div>
          <div className="col">
            <div className="service-copy">
              <h3>Brand Identity</h3>
              <p>
                A brand is more than a logo—it’s a living language of clarity
                and character. We craft identities that balance intuition with
                intention, capturing what makes a brand timeless. From
                typography to tone, every element works in harmony, creating a
                presence that’s distinct, consistent, and quietly powerful.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="outro">
        <h3>Elevate with Intention</h3>
        <p>
          At Evenrise Studios, design is not decoration—it’s direction. <br />Every
          pixel has purpose, every motion a meaning. <br />We believe progress should
          feel calm, not chaotic. <br />That clarity is the new luxury. <br />And that the
          most powerful ideas don’t shout— they rise, evenly.
        </p>
      </section>
    </>
  );
}
