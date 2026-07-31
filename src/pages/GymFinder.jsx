import { useState } from "react";
import { getNearbyGyms } from "../services/gym.service";
import { Search, MapPin, Navigation } from "lucide-react";

export default function GymFinder() {
  const [city, setCity] = useState("");
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSearched(true);
      const data = await getNearbyGyms(city);
      setGyms(data.gyms || []);
    } catch (err) {
      console.error("FIND GYM ERROR:", err.message);
      setError(err.message || "Failed to find gyms. Please try another city.");
      setGyms([]);
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}&query_place_id=${encodeURIComponent(
      name
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div className="page-header">
        <h2 className="page-title">📍 Find Gym</h2>
        <p className="page-subtitle">
          Discover nearby fitness centers and gyms in your city
        </p>
      </div>

      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Search Bar */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name (e.g. New York, Hyderabad)"
                className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8e2de2] text-neutral-800 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? "Searching..." : "Find Gyms"}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Results Grid */}
        {!loading && searched && gyms.length === 0 && !error && (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <MapPin size={48} className="mx-auto text-neutral-400 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
              No Gyms Found
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              We couldn't find any fitness centers in "{city}". Try another location.
            </p>
          </div>
        )}

        {!loading && gyms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gyms.map((gym, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
                      {gym.name}
                    </h3>
                    <span className="bg-[#8e2de2]/10 text-[#8e2de2] px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ml-2">
                      Gym
                    </span>
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm flex items-start gap-2 mb-6">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{gym.address || "Address not available"}</span>
                  </p>
                </div>

                <button
                  onClick={() =>
                    openGoogleMaps(gym.latitude, gym.longitude, gym.name)
                  }
                  className="w-full py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  View on Map
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 h-40 animate-pulse"
              >
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}