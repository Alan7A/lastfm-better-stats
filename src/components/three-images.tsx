"use client";
import { cn, getImageUrl } from "@/lib/utils";
import type { Artist } from "@/types/Artists.types";
import Link from "next/link";
import { useState } from "react";

interface Props {
  artists: Artist[];
  shape: "square" | "circle";
}

const ThreeImages = (props: Props) => {
  const { artists, shape = "square" } = props;
  const [hoverState, setHoverState] = useState<"left" | "right" | null>(null);
  const [first, second, third] = artists;
  return (
    <div className="relative h-56 w-[400px] mx-auto mt-6">
      {/* Left */}
      <Link
        href={second.url}
        target="_blank"
        className="hover:-translate-x-4 hover:rotate-1 hover:scale-105 absolute h-48 w-48 rounded-full bg-cover bg-center shadow-xl transition duration-300"
        style={{
          backgroundImage: `url(${getImageUrl(second.images)})`
        }}
        onMouseEnter={() => setHoverState("left")}
        onMouseLeave={() => setHoverState(null)}
      />
      {/* Right */}
      <Link
        href={third.url}
        target="_blank"
        className="right-0 hover:translate-x-4 hover:-rotate-1 hover:scale-105 absolute h-48 w-48 rounded-full bg-cover bg-center shadow-xl transition duration-300"
        style={{ backgroundImage: `url(${getImageUrl(third.images)})` }}
        onMouseEnter={() => setHoverState("right")}
        onMouseLeave={() => setHoverState(null)}
      />
      {/* Center */}
      <Link
        href={first.url}
        target="_blank"
        style={
          {
            backgroundImage: `url(${getImageUrl(first.images)})`,
            "--translate-x-offset":
              hoverState === "left"
                ? "-60%"
                : hoverState === "right"
                  ? "-40%"
                  : "-50%"
          } as React.CSSProperties
        }
        className={cn(
          "absolute h-48 w-48 rounded-full bg-cover bg-center shadow-xl transition duration-300 hover:scale-105",
          "left-0 right-0 -top-4",
          "transform -translate-x-[var(--translate-x-offset)]",
          hoverState !== null && "translate-y-4"
        )}
      />
    </div>
  );
};

export default ThreeImages;
