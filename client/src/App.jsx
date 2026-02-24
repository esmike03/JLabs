import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
function Home() {
  const [geo, setGeo] = useState(null);
  const [ipInput, setIpInput] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const navigate = useNavigate();

  const isValidIP = (ip) => {
    const regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(ip);
  };

  // Fetch geo info for logged-in user IP
  const fetchUserGeo = async () => {
    try {
      const res = await axios.get(`https://ipinfo.io/geo`);
      setGeo(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your IP info");
    }
  };

  const fetchIPGeo = async (ip = "") => {
    const targetIP = ip.trim() === "" || ip === "me" ? "" : ip;

    if (targetIP && !isValidIP(targetIP)) {
      setError("Invalid IP address");
      return;
    }

    try {
      const url = targetIP
        ? `https://ipinfo.io/${targetIP}/geo`
        : `https://ipinfo.io/geo`;
      const res = await axios.get(url);

      setGeo(res.data);
      setError("");

      if (targetIP && !history.includes(targetIP)) {
        setHistory((prev) => [targetIP, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch IP info");
    }
  };

  useEffect(() => {
    fetchUserGeo();
  }, []);

  const handleSearch = () => {
    fetchIPGeo(ipInput);
  };

  const handleClear = () => {
    setIpInput("");
    fetchIPGeo();
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }}
        className="bg-red-600 text-white px-4 absolute right-4 top-4 py-2 rounded"
      >
        Logout
      </button>
      <h1 className="text-2xl font-bold mb-4">IP Geolocation</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter IP address"
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <div className="flex mt-2 gap-2">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {geo && (
        <div className="bg-zinc-800 p-4 rounded mb-4">
          <p>
            <strong>IP:</strong> {geo.ip}
          </p>
          <p>
            <strong>City:</strong> {geo.city}
          </p>
          <p>
            <strong>Region:</strong> {geo.region}
          </p>
          <p>
            <strong>Country:</strong> {geo.country}
          </p>
          <p>
            <strong>Coordinates:</strong> {geo.loc}
          </p>
          <p>
            <strong>Postal:</strong> {geo.postal}
          </p>
          <p>
            <strong>Timezone:</strong> {geo.timezone}
          </p>
          <p>
            <strong>ISP:</strong> {geo.org}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="font-bold mb-2">Search History</h2>

          <ul className="list-disc list-inside">
            {history.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedHistory.includes(item)}
                  onChange={() => {
                    if (selectedHistory.includes(item)) {
                      setSelectedHistory(
                        selectedHistory.filter((ip) => ip !== item),
                      );
                    } else {
                      setSelectedHistory([...selectedHistory, item]);
                    }
                  }}
                />
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => fetchIPGeo(item)}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {history.length > 0 && ( //dont show if no history
        <button
          onClick={() => {
            setHistory(
              history.filter((item) => !selectedHistory.includes(item)),
            );
            setSelectedHistory([]);
          }}
          className="bg-red-600 text-white px-3 py-1 rounded mb-2"
          disabled={selectedHistory.length === 0} // disable if nothing selected
        >
          Delete Selected
        </button>
      )}

      {geo && geo.loc && (
        <div className="mt-4 h-64 w-full">
          <MapContainer
            center={geo.loc.split(",").map(Number)}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
            />
            <Marker position={geo.loc.split(",").map(Number)}>
              <Popup>
                {geo.city}, {geo.country}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Home;
