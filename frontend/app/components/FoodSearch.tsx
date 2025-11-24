"use client";

import { useState } from "react";
import { foods } from "../data/foods";

export default function FoodSearch({ onSelect }: { onSelect: (food: any) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);

    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const filtered = foods.filter(food =>
      food.name.toLowerCase().includes(text.toLowerCase())
    );

    setResults(filtered);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        placeholder="Buscar alimento..."
        className="border p-3 rounded w-full"
        onChange={(e) => handleSearch(e.target.value)}
      />

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded-lg shadow mt-1 max-h-40 overflow-y-auto">
          {results.map(food => (
            <li
              key={food.id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(food);
                setQuery(food.name);
                setResults([]);
              }}
            >
              {food.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
