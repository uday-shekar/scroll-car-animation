"use client";

import { useEffect, useRef } from "react";
import carPic from "../assets/car.png"; 
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Refs to access DOM elements directly for GSAP animations
  const heroRef = useRef(null);   // Main pinned hero section
  const greenRef = useRef(null);  // Green background bar
  const carRef = useRef(null);    // Moving car image
  const textRef = useRef(null);   // Main heading text
  const statsRef = useRef(null);  // Container for stats cards

  useEffect(() => {
    // Safety check: run animation only if hero section exists
    if (!heroRef.current) return;

    // GSAP context helps clean up animations automatically on unmount
    const ctx = gsap.context(() => {
      // Timeline tied to scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current, // Element that controls the scroll animation
          start: "top top",          // Start when section hits top of viewport
          end: "+=2500",             // Total scroll distance for the animation
          scrub: 1,                  // Smoothly sync animation with scroll
          pin: true,                 // Pin the section during scroll
          anticipatePin: 1,          // Prevent layout jump when pinning
        },
      });

      // 1. Green background reveal animation (left to right)
      tl.fromTo(
        greenRef.current,
        { scaleX: 0 },               // Start fully hidden
        { scaleX: 1, ease: "none", duration: 3.3 } // Reveal fully
      );

      // 2. Car movement animation (moves from left to right across screen)
      tl.fromTo(
        carRef.current,
        { x: "-1vw" },               // Start slightly outside left edge
        { x: "101vw", ease: "none", duration: 3.5 }, // Move past right edge
        0                            // Start at the same time as green reveal
      );

      // 3. Text reveal animation using clip-path (reveals behind the car)
      tl.fromTo(
        textRef.current,
        { clipPath: "inset(0 100% 0 0)" }, // Text fully clipped (hidden)
        { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 3.3 }, // Fully visible
        0                                 // Sync with car animation
      );

      // 4. Stats cards animation (fade + scale + staggered entrance)
      tl.from(
        gsap.utils.toArray(statsRef.current.children),
        {
          opacity: 0,               // Start invisible
          scale: 0.8,               // Slightly smaller
          y: 40,                    // Move up into place
          stagger: 0.2,             // One-by-one appearance
          duration: 1,
          ease: "back.out(1.7)",    // Smooth pop effect
        },
        1.2                          // Start after initial animations begin
      );
    }, heroRef);

    // Cleanup GSAP animations when component unmounts
    return () => ctx.revert();
  }, []);

  return (
    /* Main container with extra height to allow scrolling */
    <main className="h-[210vh] bg-[#d1d1d1] overflow-y-hidden">
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden bg-[#d1d1d1] flex items-center justify-center"
      >
        {/* Road / track background */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[250px] bg-[#1e1e1e] flex items-center overflow-hidden">
          
          {/* Green background bar that reveals on scroll */}
          <div
            ref={greenRef}
            className="absolute left-0 h-full w-full bg-[#45db7d] origin-left z-0"
          />

          {/* Main heading text revealed with clip-path animation */}
          <h1
            ref={textRef}
            className="absolute z-10 w-full text-center text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-black whitespace-nowrap tracking-tighter italic uppercase"
          >
            WELCOME ITZFIZZ
          </h1>

          {/* Car image that moves horizontally during scroll */}
          <img
            ref={carRef}
            src={carPic}
            alt="car"
            className="absolute z-20 left-0 w-[200px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Floating stats cards animated after initial hero animation */}
        <div ref={statsRef} className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-[12%] left-[55%] bg-[#dbec70] p-6 rounded-2xl shadow-xl w-[200px] md:w-[280px] border border-black/10">
            <h2 className="font-black text-[32px] md:text-[50px] leading-none text-black">58%</h2>
            <p className="font-bold text-black uppercase text-xs mt-1">
              Increase in pick up point use
            </p>
          </div>

          <div className="absolute bottom-[18%] left-[15%] bg-[#6ac9ff] p-6 rounded-2xl shadow-xl w-[200px] md:w-[280px] border border-black/10">
            <h2 className="font-black text-[32px] md:text-[50px] leading-none text-black">23%</h2>
            <p className="font-bold text-black uppercase text-xs mt-1">
              Decrease in customer calls
            </p>
          </div>

          <div className="absolute top-[10%] left-[12%] bg-[#1e1e1e] text-white p-6 rounded-2xl shadow-xl w-[200px] md:w-[280px]">
            <h2 className="font-black text-[32px] md:text-[50px] leading-none text-[#45db7d]">27%</h2>
            <p className="font-bold uppercase text-xs mt-1">
              Faster delivery times
            </p>
          </div>

          <div className="absolute bottom-[12%] right-[10%] bg-[#ff6a00] p-6 rounded-2xl shadow-xl w-[200px] md:w-[280px] border border-black/10">
            <h2 className="font-black text-[32px] md:text-[50px] leading-none text-black">40%</h2>
            <p className="font-bold text-black uppercase text-xs mt-1">
              Higher retention rate
            </p>
          </div>
        </div>
      </section>

      {/* Extra space below is required so the page can scroll */}
    </main>
  );
}