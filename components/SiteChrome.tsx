"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/tailgrids/core/badge";
import { Card, CardContent } from "@/components/tailgrids/core/card";
import { Product, fetchProducts } from "@/data/product";
import { cn } from "@/utils/cn";
import { Button } from "./tailgrids/core/button";
import { useRouter } from "next/navigation";
import { doLogout } from "@/utils/login";

type GlobalData = {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  cart: Product[];
  setCart: Dispatch<SetStateAction<Product[]>>;
};

export const GlobalDataContext = createContext<GlobalData | null>(null);

export function useGlobalData() {
  const ctx = useContext(GlobalDataContext);
  if (!ctx) {
    throw new Error("useGlobalData must be used within SiteChrome");
  }
  return ctx;
}

const PAGES: { path: string; label: string; end?: boolean }[] = [
  { path: "/", label: "Home", end: true },
  { path: "/calculator", label: "Calculator" },
  { path: "/animation", label: "Animation" },
  { path: "/todos", label: "Todos" },
  { path: "/products", label: "Products" },
  { path: "/cart", label: "Cart" },
  // { path: "/login", label: "Login" },
];

const LOGO = [
  { char: "C", bg: "bg-red-500", rotate: "-rotate-6" },
  { char: "S", bg: "bg-green-500", rotate: "rotate-3" },
  { char: "I", bg: "bg-blue-500", rotate: "-rotate-3" },
  { char: "2", bg: "bg-sky-400", rotate: "rotate-6" },
  { char: "0", bg: "bg-amber-400", rotate: "-rotate-3" },
  { char: "5", bg: "bg-zinc-700", rotate: "rotate-3" },
] as const;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch(() => setProducts([]));
  }, []);

  const isActive = (path: string, end?: boolean) => {
    if (end) return pathname === path;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    doLogout(router, '/');
  }

  return (
    <GlobalDataContext.Provider
      value={{ products, setProducts, cart, setCart }}
    >
      <div className="min-h-screen flex flex-col items-center">
        <header className="w-full bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-end gap-1.5 sm:gap-2">
                {LOGO.map(({ char, bg, rotate }) => (
                  <span
                    key={char}
                    className={cn(
                      bg,
                      rotate,
                      "text-white font-bold text-2xl sm:text-3xl w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center shadow-md"
                    )}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <div className="rounded-lg bg-zinc-800 text-white text-center font-bold tracking-wide px-4 sm:px-6 py-2 text-xs sm:text-sm whitespace-nowrap">
                FRONT END SOFTWARE DEVELOPMENT
              </div>
            </div>

            <nav className="flex flex-wrap justify-center gap-2">
              {PAGES.map(({ path, label, end }) => {
                const active = isActive(path, end);
                const isCart = path === "/cart";
                return (
                  <Link
                    key={path}
                    href={path}
                    className={cn(
                      "relative rounded-md px-4 py-1.5 text-sm font-semibold border transition",
                      active
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-blue-600 text-blue-600 hover:bg-blue-50"
                    )}
                  >
                    {label}
                    {path === "/products" ? ` (${products.length})` : ""}
                    {isCart && (
                      <Badge
                        color="error"
                        size="sm"
                        className="absolute -top-2 -right-2 min-w-5 justify-center px-1.5 py-0 text-[10px] leading-4 shadow-sm"
                      >
                        {cart.length}
                      </Badge>
                    )}
                  </Link>
                );
              })}
              <Button appearance={'outline'} size={'sm'} variant={'danger'} className="ml-1" onClick={handleLogout}>Logout</Button>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full flex justify-center py-8 px-4">
          <div className="w-full max-w-5xl">{children}</div>
        </main>

        <footer className="w-full bg-footer-background border-t border-base-100">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <Card className="bg-footer-card-background shadow-xs border border-base-100">
              <CardContent className="py-5 flex flex-col items-center gap-3">
                <p className="font-semibold text-title-50">
                  68023050 นายธนวรรธน์ เกติยะ
                </p>
              </CardContent>
            </Card>
          </div>
        </footer>
      </div>
    </GlobalDataContext.Provider>
  );
}
