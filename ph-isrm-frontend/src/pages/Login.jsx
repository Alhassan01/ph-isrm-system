import { useState } from "react";
import API from "../services/api";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
try {
      const res = await API.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE:", res.data); // 👈 ADD THIS


      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      window.location.href = "/dashboard";

    } catch (error) {
      console.log("LOGIN ERROR:", error.response); // 👈 ADD THIS
      alert(error.response?.data?.message || "Login failed");
    }
    // ✅ Validation
    if (!email || !password) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}




// import { useState } from "react";
// import API from "../services/api";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async () => {
//     try {
//       const res = await API.post("/auth/login", { email, password });

//       localStorage.setItem("token", res.data.token);

//       alert("Login successful");
//       window.location.href = "/dashboard";

//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>

//       <input
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// }