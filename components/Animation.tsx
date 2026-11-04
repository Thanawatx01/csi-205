"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { ButtonGroup } from "@/components/tailgrids/core/button-group";
import { cn } from "@/utils/cn";

type BallType = "none" | "football" | "basketball" | "volleyball" | "human";

type AnimationProps = {
  fieldWidth?: string;
  filedHeight?: string;
  ballRadius?: number;
  top?: number;
  left?: number;
  frameRate?: number;
};

const BALL_IMAGES: Record<Exclude<BallType, "none">, string> = {
  football: "/assets/football.png",
  basketball: "/assets/basketball.png",
  volleyball: "/assets/volleyball.png",
  human: "/assets/human.png",
};

const BALL_OPTIONS: { type: BallType; label: string }[] = [
  { type: "none", label: "None" },
  { type: "football", label: "Football" },
  { type: "basketball", label: "Basketball" },
  { type: "volleyball", label: "Volleyball" },
  { type: "human", label: "Human" },
];

export default function Animation({
  fieldWidth = "100%",
  filedHeight = "500px",
  ballRadius = 50,
  top = 0,
  left = 0,
  frameRate = 40,
}: AnimationProps) {
  const intervalMs = 1000 / frameRate;
  const ballDiameter = ballRadius * 2;

  const [ballType, setBallType] = useState<BallType>("none");
  const [position, setPosition] = useState({ top, left });
  const [isPlaying, setIsPlaying] = useState(false);

  const ballRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const velocityRef = useRef({
    vx: 10 * Math.cos((45 * Math.PI) / 180),
    vy: 10 * Math.sin((45 * Math.PI) / 180),
  });
  const rotationRef = useRef(0);

  useEffect(() => {
    if (!ballRef.current) return;

    if (ballType !== "none") {
      ballRef.current.style.backgroundImage = `url(${BALL_IMAGES[ballType]})`;
      ballRef.current.style.backgroundSize = "cover";
    } else {
      ballRef.current.style.backgroundImage = "none";
      ballRef.current.style.backgroundSize = "auto";
    }
  }, [ballType]);

  useEffect(() => {
    if (ballRef.current && isPlaying) {
      ballRef.current.style.top = `${position.top}px`;
      ballRef.current.style.left = `${position.left}px`;
      ballRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      ballRef.current.style.transition = "transform 1.2s ease-in-out";
    }
  }, [position, isPlaying]);

  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  const handlePlay = () => {
    if (!wallRef.current) return;

    setIsPlaying(true);
    const maxX = wallRef.current.clientWidth - ballDiameter;
    const maxY = wallRef.current.clientHeight - ballDiameter;

    intervalIdRef.current = setInterval(() => {
      setPosition((prev) => {
        let { vx, vy } = velocityRef.current;
        let nextLeft = prev.left + vx;
        let nextTop = prev.top + vy;

        if (nextLeft <= 0) {
          nextLeft = 0;
          vx = Math.abs(vx);
          rotationRef.current = 180;
        } else if (nextLeft >= maxX) {
          nextLeft = maxX;
          vx = -Math.abs(vx);
          rotationRef.current = 0;
        }

        if (nextTop <= 0) {
          nextTop = 0;
          vy = Math.abs(vy);
          rotationRef.current = 90;
        } else if (nextTop >= maxY) {
          nextTop = maxY;
          vy = -Math.abs(vy);
          rotationRef.current = 270;
        }

        velocityRef.current = { vx, vy };
        return { top: nextTop, left: nextLeft };
      });
    }, intervalMs);
  };

  const pausePlay = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    setIsPlaying(false);
  };

  return (
    <div className="w-full">
      <div
        ref={wallRef}
        className="border-2 border-base-300 rounded-2xl relative overflow-hidden shadow-sm"
        style={{
          width: fieldWidth,
          height: filedHeight,
          backgroundImage: "url(/assets/floor.jpeg)",
          backgroundSize: "cover",
        }}
      >
        <div
          ref={ballRef}
          className="bg-info-500 rounded-full absolute"
          style={{
            width: `${ballDiameter}px`,
            height: `${ballDiameter}px`,
            top: `${top}px`,
            left: `${left}px`,
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-3 mt-4">
        {isPlaying ? (
          <Button variant="danger" size="lg" onPress={pausePlay}>
            Pause
          </Button>
        ) : (
          <Button variant="success" size="lg" onPress={handlePlay}>
            Play
          </Button>
        )}

        <ButtonGroup variant="primary" size="md" className="flex-wrap">
          {BALL_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setBallType(type)}
              className={cn(
                ballType === type &&
                  "bg-button-group-primary-hover-background text-button-group-primary-hover-text"
              )}
            >
              {label}
            </button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}
