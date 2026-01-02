"use client";

import { useEffect, useState } from "react";

function getWindowWidth() {
  if (typeof window === "undefined") {
    return 0;
  }
  const { innerWidth: width } = window;
  return width;
}

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}
