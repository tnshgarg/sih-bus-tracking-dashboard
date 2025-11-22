import React, { useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (city: string) => void;
  cityList: string[];
  disabled?: boolean;
}

export default function CityAutocomplete({ label, value, onChange, cityList, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);

  const filtered = cityList.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block font-semibold mb-2 text-gray-700">{label}</label>

      <input
        type="text"
        className="border px-3 py-2 rounded-lg w-full text-gray-700 bg-gray-50"
        placeholder="Search city..."
        disabled={disabled}
        value={query || value}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(""); // reset selected city
          setShowList(true);
        }}
        onFocus={() => setShowList(true)}
      />

      {showList && (
        <ul className="absolute left-0 right-0 bg-white border rounded-lg max-h-52 overflow-auto shadow-md z-50">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-gray-500 text-sm">No matches</li>
          ) : (
            filtered.map((city) => (
              <li
                key={city}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setQuery(city);
                  onChange(city);
                  setShowList(false);
                }}
              >
                {city}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}