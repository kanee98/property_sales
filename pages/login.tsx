import { useState } from "react";
import { useRouter } from "next/router";
import "../components/login.css"

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard"); // Redirect to admin dashboard
    } else {
      setError("Invalid email or password");
    }
  }

  const redirectToListings = () => {
    window.location.href = "/listings";
  };
  return (
    <div>
      <form>
        <button type="button" onClick={redirectToListings}>
          Listings
        </button>
      </form>
      <div className="login">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="btn btn-primary btn-block btn-large">Login.</button>
        </form>
      </div>
      {/* <h2>Corporate Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form> */}
      {error && <p>{error}</p>}
    </div>
  );
}
