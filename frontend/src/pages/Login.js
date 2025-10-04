import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email:"", password:"" });
  const nav = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", data);
    localStorage.setItem("token", res.data.token);
    nav("/notes");
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    alert(error.response?.data?.msg || "Login failed");
  }
};

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e=>setData({...data, email:e.target.value})}/>
        <input type="password" placeholder="Password" onChange={e=>setData({...data, password:e.target.value})}/>
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/signup">Signup</Link></p>
    </div>
  );
}
