'use client';

import { useEffect, useRef, useState } from "react";
import { NavBar } from "./Navbar";
import Image from "next/image";

export default function Header() {
  const images = ["1.svg", "2.png", "3.svg", "4.jpg"];
  const extendedImages = [images[images.length - 1], ...images, images[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const mouseDownRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTransitionEnd = () => {
    if (currentIndex === extendedImages.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 0);
    } else if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(images.length);
      }, 0);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
    }
  }, [isTransitioning]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTransitioning) return;
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e : React.TouchEvent) => {
    if (!isTransitioning) return;
    touchEndXRef.current = e.changedTouches[0].clientX;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrevious();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTransitioning) return;
    mouseDownRef.current = true;
    touchStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isTransitioning || !mouseDownRef.current) return;
    mouseDownRef.current = false;
    touchEndXRef.current = e.clientX;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrevious();
  };

  const handleMouseLeave = () => {
    mouseDownRef.current = false;
  };

  const goToNext = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (!isTransitioning) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const getTransform = () => {
    return `translateX(-${currentIndex * 100}%)`;
  };

  return (
    <div className="relative w-full h-[850px] overflow-hidden bg-black">
      <NavBar />
      <div
        className="w-full h-full relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: "grab", userSelect: "none" }}
      >
        {/* Carousel */}
        <div
          className={`flex h-full w-full ${
            isTransitioning ? "transition-transform duration-[1500ms] ease-in-out" : ""
          }`}
          style={{ transform: getTransform() }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedImages.map((src, idx) => (
              <div key={idx} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={`/${src}`} // Make sure images are in the public folder
                  alt={`Slide ${idx}`}
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </div>
            ))}
        </div>

        {/* Transparent Glassmorphism Form */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20 w-[90%] max-w-sm 
                        backdrop-blur-lg bg-white/50 border border-white/30 text-white 
                        rounded-4xl shadow-2xl p-6 mr-12 mt-40">
          <h2 className="text-2xl font-bold mb-4 text-center">Get in Touch</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 rounded-md bg-[#F1F2F6] text-black placeholder-black focus:outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 rounded-md bg-[#F1F2F6] text-black placeholder-black focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-[#F1F2F6] text-black placeholder-black focus:outline-none"
            />
            <input
              type="text"
              placeholder="Pincode"
              className="w-full px-4 py-2 rounded-md bg-[#F1F2F6] text-black placeholder-black focus:outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#DDCDC1] hover:bg-red-300 text-black py-2 rounded-4xl font-semibold transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
