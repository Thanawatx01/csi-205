"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLogin } from "@/utils/login";

const OPERATORS = ["+", "−", "×", "÷"] as const;
type Operator = (typeof OPERATORS)[number];

const btnBase =
  "rounded-xl text-xl py-3 px-1 cursor-pointer border border-gray-300 hover:brightness-95 transition";

const btnNumber = `${btnBase} bg-sky-200`;
const btnMemory = `${btnBase} bg-green-200`;
const btnOperator = `${btnBase} bg-green-200`;
const btnFn = `${btnBase} bg-green-200`;
const btnClear = `${btnBase} bg-orange-500 text-white border-orange-600`;
const btnNeutral = `${btnBase} bg-gray-100`;

function formatNumber(value: string | null): string | null {
  if (value === "Error" || value == null || value === "") return value;

  const str = String(value);
  const neg = str.startsWith("-");
  const raw = neg ? str.slice(1) : str;
  const [intPart, decPart] = raw.split(".");
  const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const out = decPart !== undefined ? `${withComma}.${decPart}` : withComma;

  return neg ? `-${out}` : out;
}

export default function Calculator() {
  const router = useRouter();

  useEffect(() => {
    isLogin(router, '/calculator');
  }, [router])
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [operator, setOperatorState] = useState<Operator | null>(null);
  const [display, setDisplay] = useState("0");
  const [, setTotal] = useState<number | null>(null);
  const [equalsPressed, setEqualsPressed] = useState(false);
  const [numberCleared, setNumberCleared] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearLabel = display !== "0" && display !== "Error" ? "C" : "CE";

  const calculate = (aStr: string, bStr: string, op: Operator): number | null => {
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    switch (op) {
      case "+":
        return a + b;
      case "−":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return null;
    }
  };

  const number = (value: string) => {
    setIsError(false);

    if (equalsPressed) {
      setFirst(null);
      setSecond(null);
      setOperatorState(null);
      setTotal(null);
      setEqualsPressed(false);
      setNumberCleared(false);
      setDisplay(value);
      setFirst(value);
      return;
    }

    setNumberCleared(false);

    if (operator === null) {
      const next = display === "0" || first === null ? value : display + value;
      setDisplay(next);
      setFirst(next);
    } else {
      const next = second === null ? value : display + value;
      setDisplay(next);
      setSecond(next);
    }
  };

  const applyOperator = (value: Operator) => {
    if (!OPERATORS.includes(value)) return;

    if (first === null) {
      setIsError(true);
      return;
    }

    let nextFirst = first;
    let nextSecond = second;

    if (equalsPressed) {
      nextSecond = null;
      setSecond(null);
      setEqualsPressed(false);
    }

    if (operator !== null && nextSecond !== null && !numberCleared) {
      const computed = calculate(nextFirst, nextSecond, operator);
      nextFirst = String(computed);
      setFirst(nextFirst);
      setSecond(null);
      setDisplay(nextFirst);
    }

    setOperatorState(value);
    setTotal(null);
    setNumberCleared(false);
    setIsError(false);
  };

  const result = () => {
    if (operator === null || first === null) {
      setIsError(true);
      return;
    }

    try {
      const b = second === null ? first : second;
      const computed = calculate(first, b, operator);

      if (computed === null || !isFinite(computed)) {
        throw new Error("Invalid result");
      }

      const asStr = String(computed);
      setDisplay(asStr);
      setFirst(asStr);
      setSecond(b);
      setTotal(computed);
      setEqualsPressed(true);
      setNumberCleared(false);
      setIsError(false);
    } catch {
      setDisplay("Error");
      setFirst(null);
      setSecond(null);
      setOperatorState(null);
      setTotal(null);
      setEqualsPressed(false);
      setNumberCleared(false);
      setIsError(true);
    }
  };

  const clearNumber = () => {
    if (operator !== null) {
      setSecond(null);
      setDisplay("0");
      setNumberCleared(true);
      setEqualsPressed(false);
      setTotal(null);
      setIsError(false);
      return;
    }

    setFirst(null);
    setSecond(null);
    setDisplay("0");
    setTotal(null);
    setEqualsPressed(false);
    setNumberCleared(false);
    setIsError(false);
  };

  const clearOperator = () => {
    setOperatorState(null);
    setSecond(null);
    setFirst(null);
    setDisplay("0");
    setTotal(null);
    setNumberCleared(false);
    setEqualsPressed(false);
    setIsError(false);
  };

  const handleClear = () => {
    if (clearLabel === "C") clearNumber();
    else clearOperator();
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "=") {
        result();
        return;
      }
      if (e.key === "Escape" || e.key === "Backspace" || e.key.toLowerCase() === "c") {
        handleClear();
        return;
      }
      if (e.key >= "0" && e.key <= "9") {
        number(e.key);
        return;
      }
      if (e.key === "/" || e.key === "÷") {
        applyOperator("÷");
        return;
      }
      if (e.key === "*" || e.key === "x" || e.key === "X") {
        applyOperator("×");
        return;
      }
      if (e.key === "-" || e.key === "−") {
        applyOperator("−");
        return;
      }
      if (e.key === "+") {
        applyOperator("+");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const opClass = (op: Operator) =>
    `${btnOperator} ${operator === op ? "!bg-blue-500 text-white border-blue-500" : ""}`;

  return (
    <div className="w-[400px] max-w-full bg-gray-100 rounded-[10px] p-5 shadow-md">
      <div
        className={`h-[70px] bg-white rounded-[10px] px-5 flex justify-end items-center text-3xl shadow-sm border border-gray-200 ${
          isError ? "text-red-500" : "text-black"
        }`}
      >
        {display === "Error" ? "Error" : formatNumber(display)}
      </div>

      <div className="grid grid-cols-5 gap-2.5 pt-5">
        <button type="button" className={btnMemory}>
          MC
        </button>
        <button type="button" className={btnMemory}>
          MR
        </button>
        <button type="button" className={btnMemory}>
          M+
        </button>
        <button type="button" className={btnMemory}>
          M-
        </button>
        <button type="button" className={btnClear} onClick={handleClear}>
          {clearLabel}
        </button>

        <button type="button" className={btnNumber} onClick={() => number("7")}>
          7
        </button>
        <button type="button" className={btnNumber} onClick={() => number("8")}>
          8
        </button>
        <button type="button" className={btnNumber} onClick={() => number("9")}>
          9
        </button>
        <button type="button" className={opClass("÷")} onClick={() => applyOperator("÷")}>
          ÷
        </button>
        <button type="button" className={btnFn}>
          √
        </button>

        <button type="button" className={btnNumber} onClick={() => number("4")}>
          4
        </button>
        <button type="button" className={btnNumber} onClick={() => number("5")}>
          5
        </button>
        <button type="button" className={btnNumber} onClick={() => number("6")}>
          6
        </button>
        <button type="button" className={opClass("×")} onClick={() => applyOperator("×")}>
          ×
        </button>
        <button type="button" className={btnFn}>
          %
        </button>

        <button type="button" className={btnNumber} onClick={() => number("1")}>
          1
        </button>
        <button type="button" className={btnNumber} onClick={() => number("2")}>
          2
        </button>
        <button type="button" className={btnNumber} onClick={() => number("3")}>
          3
        </button>
        <button type="button" className={opClass("−")} onClick={() => applyOperator("−")}>
          −
        </button>
        <button type="button" className={btnFn}>
          1/x
        </button>

        <button type="button" className={btnNumber} onClick={() => number("0")}>
          0
        </button>
        <button type="button" className={btnNeutral}>
          .
        </button>
        <button type="button" className={btnNeutral}>
          +/-
        </button>
        <button type="button" className={opClass("+")} onClick={() => applyOperator("+")}>
          +
        </button>
        <button type="button" className={btnFn} onClick={result}>
          =
        </button>
      </div>
    </div>
  );
}
