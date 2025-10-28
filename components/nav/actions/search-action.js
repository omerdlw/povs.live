"use client";

import { useNavigationContext } from "@/contexts/navigation-context";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export default function SearchAction({ placeholder }) {
  const { searchQuery, setSearchQuery } = useNavigationContext();
  const [focus, setFocus] = useState(false);
  const containerRef = useRef();
  const inputRef = useRef();

  function handleFocus() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setFocus(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={classNames(
        "h-auto rounded-secondary mt-2.5 w-full flex items-center p-3 border bg-base/5",
        {
          "border-transparent": !focus,
          "border-primary": focus,
        }
      )}
      onClick={(event) => {
        event.stopPropagation();
        setFocus(true);
        handleFocus();
      }}
    >
      <input
        className="w-full bg-transparent focus:outline-none placeholder-black/50 dark:placeholder-white/50"
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        placeholder={placeholder}
        value={searchQuery}
        ref={inputRef}
        type="text"
      />
    </div>
  );
}
