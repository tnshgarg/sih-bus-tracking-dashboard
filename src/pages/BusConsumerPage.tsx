import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";

// Popular Indian cities
const cityList = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
  "Ahmedabad", "Kolkata", "Pune", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Patna",
  "Bhopal", "Agra", "Coimbatore", "Thane", "Varanasi"
];

const busOperators = [
  "SRS Travels", "VRL Travels", "KSRTC", "KPN Travels", "Orange Tours",
  "Redline", "National Travels", "Sharma Travels", "Rajesh Travels", "Jabbar Travels",
  "Paulo Travels", "Neeta Travels", "Parveen Travels", "Sri Sai Travels", "Sundar Travels"
];
const types = ["AC Sleeper", "Non-AC Seater", "Volvo MultiAxle", "AC Seater", "Sleeper"];
const statusOptions = ["on-time", "early", "delayed"];
const sortOptions = [
  { label: "Price (Low to High)", value: "price-asc" },
  { label: "Price (High to Low)", value: "price-desc" },
  { label: "Departure (Earliest First)", value: "dep-asc" },
  { label: "Departure (Latest First)", value: "dep-desc" },
];

function toDepartureMinutes(dep: string) {
  // accepts "H:MM" or "HH:MM" - returns minutes since 00:00
  const parts = String(dep).split(":").map(Number);
  const hh = isNaN(parts[0]) ? 0 : parts[0];
  const mm = isNaN(parts[1]) ? 0 : parts[1];
  return hh * 60 + mm;
}

function minutesToHHMM(mins: number) {
  const m = ((mins % (24 * 60)) + 24 * 60) % (24 * 60); // normalize
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
function hhmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Create 7 buses per route  
function generateRouteBusMap() {
  const busMap: Record<string, any[]> = {};
  let busCounter = 1000;
  for (let i = 0; i < cityList.length; i++) {
    for (let j = 0; j < cityList.length; j++) {
      if (i === j) continue;
      const pickup = cityList[i];
      const drop = cityList[j];
      const routeKey = `${pickup}-${drop}`;
      busMap[routeKey] = [];
      for (let k = 0; k < 7; k++) {
        const departureHour = 15 + Math.floor(Math.random() * 9); // 15..23
        const departure = `${String(departureHour).padStart(2, "0")}:${k % 2 === 0 ? "00" : "30"}`;
        const arrivalHour = (departureHour + Math.floor(Math.random() * 12)) % 24;
        const arrival = `${String(arrivalHour).padStart(2, "0")}:${k % 2 === 0 ? "30" : "15"}`;
        busMap[routeKey].push({
          bus_id: `RB${busCounter++}`,
          operator: busOperators[Math.floor(Math.random() * busOperators.length)],
          type: types[Math.floor(Math.random() * types.length)],
          route_name: routeKey,
          pickup,
          drop,
          price: 500 + Math.floor(Math.random() * 700),
          departure,
          arrival,
          seats_left: Math.floor(Math.random() * 30) + 5,
          occupancy: Math.floor(Math.random() * 60),
          occupancy_capacity: 60,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
        });
      }
    }
  }
  return busMap;
}
const routeBusMap = generateRouteBusMap();

export default function BusConsumerPage() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [operator, setOperator] = useState("");
  const [busType, setBusType] = useState("");
  const [status, setStatus] = useState("");
  const [priceMin, setPriceMin] = useState(500);
  const [priceMax, setPriceMax] = useState(1200);
  const [pricePreset, setPricePreset] = useState("");
  // departure window (minutes from 00:00)
  const [depMin, setDepMin] = useState(15 * 60);
  const [depMax, setDepMax] = useState(23 * 60);
  // arrival window (minutes from 00:00)
  const [arrivalMin, setArrivalMin] = useState(0);
  const [arrivalMax, setArrivalMax] = useState(24 * 60 - 1);

  const [sortBy, setSortBy] = useState(""); // empty = default (no sort)

  let filteredBuses =
    !showResults || !pickup || !drop
      ? []
      : (routeBusMap[`${pickup}-${drop}`] || []).filter((bus: any) => {
          if (operator && bus.operator !== operator) return false;
          if (busType && bus.type !== busType) return false;
          if (status && bus.status !== status) return false;
          if (bus.price < priceMin || bus.price > priceMax) return false;
          const depMinutes = toDepartureMinutes(bus.departure);
          if (depMinutes < depMin || depMinutes > depMax) return false;
          const arrMinutes = toDepartureMinutes(bus.arrival);
          if (arrMinutes < arrivalMin || arrMinutes > arrivalMax) return false;
          return true;
        });

  // Sorting logic - do not mutate original array
  let sortedBuses = filteredBuses;
  if (sortBy === "price-asc") {
    sortedBuses = [...filteredBuses].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    sortedBuses = [...filteredBuses].sort((a, b) => b.price - a.price);
  } else if (sortBy === "dep-asc") {
    sortedBuses = [...filteredBuses].sort((a, b) => toDepartureMinutes(a.departure) - toDepartureMinutes(b.departure));
  } else if (sortBy === "dep-desc") {
    sortedBuses = [...filteredBuses].sort((a, b) => toDepartureMinutes(b.departure) - toDepartureMinutes(a.departure));
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      <Sidebar />
      <div className="flex-1 lg:pl-55">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Consumer Bus Portal</h1>
          </div>

          {/* Main search */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-gray-700">Pickup Location</label>
                <select
                  className="border px-3 py-2 rounded-lg w-full text-gray-700 bg-gray-50"
                  value={pickup}
                  onChange={e => { setPickup(e.target.value); setShowResults(false); }}
                >
                  <option value="">Select City</option>
                  {cityList.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-2 text-gray-700">Drop Location</label>
                <select
                  className="border px-3 py-2 rounded-lg w-full text-gray-700 bg-gray-50"
                  value={drop}
                  onChange={e => { setDrop(e.target.value); setShowResults(false); }}
                  disabled={!pickup}
                >
                  <option value="">Select City</option>
                  {cityList.filter(city => city !== pickup).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  disabled={!pickup || !drop}
                  onClick={() => setShowResults(true)}
                >
                  Search Buses
                </button>
              </div>
            </div>
          </div>

          {/* --- FILTER UI START --- */}
          {showResults && filteredBuses.length >= 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="font-bold text-lg text-gray-800 mb-3">Filters</div>

              {/* First row */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Operator</label>
                  <select className="border px-2 py-1 rounded w-full text-gray-700"
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                  >
                    <option value="">All operators</option>
                    {busOperators.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Bus Type</label>
                  <select
                    className="border px-2 py-1 rounded w-full text-gray-700"
                    value={busType}
                    onChange={e => setBusType(e.target.value)}
                  >
                    <option value="">All types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Status</label>
                  <select
                    className="border px-2 py-1 rounded w-full text-gray-700"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="">Any status</option>
                    {statusOptions.map(op => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Sort By</label>
                  <select
                    className="border px-2 py-1 rounded w-full text-gray-700"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option value="">Default (no sort)</option>
                    {sortOptions.map(sort => (
                      <option key={sort.value} value={sort.value}>{sort.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Second row: Price range, Departure time window, Arrival time window */}
              <div className="flex flex-col md:flex-row gap-4 md:gap-4 mb-2">
                <div className="flex-4">
                  <label className="block mb-2 font-semibold text-sm text-gray-600">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <select
                      className="border px-2 py-1 rounded w-48 md:w-40 text-gray-700 bg-white"
                      value={pricePreset}
                      onChange={e => {
                        const v = e.target.value;
                        setPricePreset(v);
                        if (v === "100-500") { setPriceMin(100); setPriceMax(500); }
                        else if (v === "500-1000") { setPriceMin(500); setPriceMax(1000); }
                        else if (v === "100-1500") { setPriceMin(100); setPriceMax(1500); }
                        else if (v === "1500+") { setPriceMin(1500); setPriceMax(999999); }
                        else { /* custom -> do nothing */ }
                      }}
                    >
                      <option value="">Default</option>
                      <option value="100-500">100 - 500</option>
                      <option value="500-1000">500 - 1000</option>
                      <option value="100-1500">100 - 1500</option>
                      <option value="1500+">More than 1500</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Departure Between</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-1/2 text-gray-700"
                      value={minutesToHHMM(depMin)}
                      onChange={e => setDepMin(hhmmToMinutes(e.target.value))}
                    />
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-1/2 text-gray-700"
                      value={minutesToHHMM(depMax)}
                      onChange={e => setDepMax(hhmmToMinutes(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block mb-1 font-semibold text-sm text-gray-600">Arrival Between</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-1/2 text-gray-700"
                      value={minutesToHHMM(arrivalMin)}
                      onChange={e => setArrivalMin(hhmmToMinutes(e.target.value))}
                    />
                    <input
                      type="time"
                      className="border px-2 py-1 rounded w-1/2 text-gray-700"
                      value={minutesToHHMM(arrivalMax)}
                      onChange={e => setArrivalMax(hhmmToMinutes(e.target.value))}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}
          {/* --- FILTER UI END --- */}

          {showResults && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Buses from <span className="text-blue-600">{pickup}</span> to <span className="text-blue-600">{drop}</span>
              </h2>
              {sortedBuses.length === 0 ? (
                <div className="text-gray-500 mt-4 bg-white rounded-lg p-8 text-center border">No buses found for this route with these filters.</div>
              ) : (
                <div className="space-y-5">
                  {sortedBuses.map((bus: any) => (
                    <div key={bus.bus_id} className="bg-white rounded-xl shadow-md border p-5 flex flex-col md:flex-row items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-lg font-bold text-blue-700">{bus.operator}</span>
                          <span className="ml-2 text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5">{bus.type}</span>
                        </div>
                        <div className="text-sm font-medium mb-1">
                          <span className="font-semibold text-gray-500">Departure:</span>
                          <span className="font-semibold text-blue-700"> {bus.departure}</span>
                          {" — "}
                          <span className="text-green-700">{bus.arrival}</span>
                        </div>
                        <div className="text-sm mb-1 text-gray-600"><span className="font-semibold">Bus No:</span> {bus.bus_id}</div>
                        <div className="flex gap-2 text-xs mb-1">
                          <span className="font-semibold text-gray-600">Status:</span>
                          <span className={`font-semibold ${bus.status === "on-time" ? "text-green-600" : bus.status === "early" ? "text-blue-800" : "text-yellow-600"}`}>{bus.status}</span>
                          <span className="font-semibold ml-3 text-gray-600">Seats left:</span>
                          <span className={`font-semibold ${bus.seats_left < 10 ? "text-red-600" : "text-green-600"}`}>{bus.seats_left}</span>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-end gap-2 md:ml-6 md:w-32 mt-2 md:mt-0">
                        <div className="font-bold text-lg text-gray-900">₹{bus.price}</div>
                        <button className="bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold shadow hover:bg-blue-700 transition">Book Seats</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}