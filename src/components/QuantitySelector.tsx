"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    className
}: QuantitySelectorProps) {
    const [inputValue, setInputValue] = useState<string | number>(value);

    // Sync input value when prop changes externally (but not while typing if we can avoid it)
    // Actually, simple sync is fine if we only push changes up on blur/enter.
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "" || /^[0-9]+$/.test(val)) {
            setInputValue(val);
        }
    };

    const commitChange = () => {
        let newVal = typeof inputValue === "string" ? parseInt(inputValue) : inputValue;

        if (isNaN(newVal) || newVal < min) newVal = min;
        if (newVal > max) newVal = max;

        setInputValue(newVal); // Snap back to valid
        if (newVal !== value) {
            onChange(newVal);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        }
    };

    const decrease = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (value > min) onChange(value - 1);
    };

    const increase = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (value < max) onChange(value + 1);
    };

    return (
        <div className={cn("flex items-center bg-slate-100 rounded-lg p-1", className)}>
            <button
                onClick={decrease}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-[#329ebf] disabled:opacity-50 transition-colors flex-shrink-0"
                disabled={value <= min}
            >
                <Minus className="w-4 h-4" />
            </button>
            <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={commitChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()} // Prevent card click
                className="w-12 text-center bg-transparent border-none font-mono font-bold text-slate-800 focus:outline-none focus:ring-0 p-0 text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
                onClick={increase}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white shadow-sm text-slate-600 hover:text-[#329ebf] disabled:opacity-50 transition-colors flex-shrink-0"
                disabled={value >= max}
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}
