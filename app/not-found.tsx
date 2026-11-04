"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isLogin } from "@/utils/login";

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        isLogin(router, '/');
    }, [router])
  return <div>NotFound</div>;
}