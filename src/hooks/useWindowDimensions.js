import { useState, useEffect, useMemo } from "react";

export default function useWindowDimensions() {
  const getWindowDimensions = useMemo(() => {
    const { innerWidth: width } =
      typeof window !== "undefined" ? window : { innerWidth: 1920 };
    return {
      width,
    };
  }, []);

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getWindowDimensions]);

  return windowDimensions;
}
