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
  const countryCoords = {
    US: [37.0902, -95.7129], // United States
    PH: [12.8797, 121.774], // Philippines
    CA: [56.1304, -106.3468], // Canada
    GB: [55.3781, -3.436], // United Kingdom
    AU: [-25.2744, 133.7751], // Australia
    IN: [20.5937, 78.9629], // India
    DE: [51.1657, 10.4515], // Germany
    FR: [46.2276, 2.2137], // France
    BR: [-14.235, -51.9253], // Brazil
    RU: [61.524, 105.3188], // Russia
    CN: [35.8617, 104.1954], // China
    JP: [36.2048, 138.2529], // Japan
    KR: [35.9078, 127.7669], // South Korea
    IT: [41.8719, 12.5674], // Italy
    ES: [40.4637, -3.7492], // Spain
    MX: [23.6345, -102.5528], // Mexico
    ZA: [-30.5595, 22.9375], // South Africa
    NG: [9.082, 8.6753], // Nigeria
    AR: [-38.4161, -63.6167], // Argentina
    SE: [60.1282, 18.6435], // Sweden
    NO: [60.472, 8.4689], // Norway
    NL: [52.1326, 5.2913], // Netherlands
    CH: [46.8182, 8.2275], // Switzerland
    SG: [1.3521, 103.8198], // Singapore
    AE: [23.4241, 53.8478], // United Arab Emirates
    TR: [38.9637, 35.2433], // Turkey
    EG: [26.8206, 30.8025], // Egypt
    SA: [23.8859, 45.0792], // Saudi Arabia
  };

  const isValidIP = (ip) => {
    const regex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    return regex.test(ip);
  };

  // Fetch geo info for logged-in user IP
  const fetchUserGeo = async () => {
    try {
      const res = await axios.get(
        `https://api.ipinfo.io/lite/me?token=eafd4ae3a43ccf`,
      );
      setGeo(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your IP info");
    }
  };

  // Fetch geo info for a user input IP
  const fetchIPGeo = async (ip) => {
    if (ip !== "me" && !isValidIP(ip)) {
      setError("Invalid IP address");
      return;
    }
    try {
      const res = await axios.get(
        `https://api.ipinfo.io/lite/${ip}?token=eafd4ae3a43ccf`,
      );

      setGeo(res.data);
      setError("");
      if (ip !== "me" && !history.includes(ip)) {
        setHistory((prev) => [ip, ...prev]);
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
    fetchIPGeo("me");
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
            <strong>ASN:</strong> {geo.asn}
          </p>
          <p>
            <strong>AS Name:</strong> {geo.as_name}
          </p>
          <p>
            <strong>AS Domain:</strong> {geo.as_domain}
          </p>
          <p>
            <strong>Country:</strong> {geo.country} ({geo.country_code})
          </p>
          <p>
            <strong>Continent:</strong> {geo.continent} ({geo.continent_code})
          </p>
          <p>
            <strong>Bogon:</strong> {geo.bogon ? "Yes" : "No"}
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

      {geo && (
        <div className="mt-4 h-64 w-full">
          <MapContainer
            center={countryCoords[geo.country_code] || [0, 0]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Marker position={countryCoords[geo.country_code] || [0, 0]}>
              <Popup>{geo.country}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default Home;
