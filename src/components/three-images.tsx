"use client";
import { cn, getImageUrl } from "@/lib/utils";
import type { Album } from "@/types/Albums.types";
import type { Artist } from "@/types/Artists.types";
import type { Track } from "@/types/Tracks";
import Link from "next/link";
import { useState } from "react";

interface Props {
  items: Artist[] | Album[] | Track[];
  shape: "square" | "circle";
}

const ThreeImages = (props: Props) => {
  const { items, shape = "square" } = props;
  const [hoverState, setHoverState] = useState<"left" | "right" | null>(null);
  const [first, second, third] = items;
  return (
    <div className="relative h-56 w-[400px] mx-auto mt-6">
      {/* Left */}
      {second ? (
        <Link
          href={second.url}
          target="_blank"
          className={cn(
            "top-4 hover:-translate-x-4 hover:-rotate-2 hover:scale-[1.25] hover:top-2 absolute h-40 w-40 rounded bg-cover bg-center shadow-xl transition duration-300",
            shape === "circle" ? "rounded-full" : ""
          )}
          style={{
            backgroundImage: `url(${getImageUrl(second.image)})`
          }}
          onMouseEnter={() => setHoverState("left")}
          onMouseLeave={() => setHoverState(null)}
        />
      ) : null}
      {/* Right */}
      {third ? (
        <Link
          href={third.url}
          target="_blank"
          className={cn(
            "top-4 right-0 hover:translate-x-4 hover:rotate-2 hover:scale-[1.25] hover:top-2 absolute h-40 w-40 rounded bg-cover bg-center shadow-xl transition duration-300",
            shape === "circle" ? "rounded-full" : ""
          )}
          style={{ backgroundImage: `url(${getImageUrl(third.image)})` }}
          onMouseEnter={() => setHoverState("right")}
          onMouseLeave={() => setHoverState(null)}
        />
      ) : null}
      {/* Center */}
      <Link
        href={first.url}
        target="_blank"
        style={
          {
            backgroundImage: `url(${getImageUrl(first.image)})`,
            "--translate-x-offset":
              hoverState === "left"
                ? "-60%"
                : hoverState === "right"
                  ? "-40%"
                  : "-50%"
          } as React.CSSProperties
        }
        className={cn(
          "absolute h-48 w-48 rounded bg-cover bg-center shadow-xl transition duration-300 hover:scale-105",
          "left-0 right-0 -top-4",
          "transform -translate-x-[var(--translate-x-offset)]",
          shape === "circle" ? "rounded-full" : "",
          hoverState !== null && "translate-y-4"
        )}
      />
    </div>
  );
};

export default ThreeImages;
