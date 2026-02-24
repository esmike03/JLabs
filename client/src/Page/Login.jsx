import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // save token or user
        localStorage.setItem("user", JSON.stringify(data));
        // redirect to home
        navigate("/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="bg-zinc-900 rounded-xl px-8 p-6 w-full h-full">
        <h1 className="font-bold mb-4">Log In</h1>

        {error && <p className="text-red-500">{error}</p>}

        <div className="my-4">
          <label className="flex">Email:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border w-60 h-12 rounded-md p-1"
          />
        </div>

        <div className="my-4">
          <label className="flex">Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border w-60 h-12 rounded-md p-1"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded-md"
        >
          Log In
        </button>
        <p className="mt-4">Credentials is in server/seed.js</p>
      </div>
    </>
  );
}

export default Login;
