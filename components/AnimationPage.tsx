"use client";

import { useState } from "react";
import Animation from "@/components/Animation";
import { Badge } from "@/components/tailgrids/core/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/tailgrids/core/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLogin } from "@/utils/login";

export default function AnimationPage() {
  const router = useRouter();

  useEffect(() => {
    isLogin(router, '/animation');
  }, [router])
  const [frameRate, setFrameRate] = useState(25);

  return (
    <Card className="border border-base-100 shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge color="success" size="sm">
            Week 4
          </Badge>
        </div>
        <CardTitle>Animation Lab</CardTitle>
        <CardDescription>
          ควบคุม Frame Rate แล้วกด Play เพื่อให้ลูกบอลเคลื่อนที่
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-5 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="frameRate" className="text-sm font-medium text-input-label-text">
            Frame Rate
          </label>
          <input
            id="frameRate"
            className="w-28 rounded-lg border border-base-200 bg-input-background px-3 py-2 text-sm shadow-xs focus:border-input-primary-focus-border focus:outline-none focus:ring-2 focus:ring-primary-200"
            type="number"
            min={1}
            max={1000}
            value={frameRate}
            onChange={(e) => setFrameRate(Number(e.target.value) || 1)}
          />
        </div>
        <Animation
          fieldWidth="100%"
          filedHeight="500px"
          ballRadius={50}
          top={0}
          left={0}
          frameRate={frameRate}
        />
      </CardContent>
    </Card>
  );
}
