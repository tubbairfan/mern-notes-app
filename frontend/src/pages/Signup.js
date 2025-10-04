import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
export default function Signup() {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const nav = useNavigate();

  // Validation 
  const validate = () => {
    const newErrors = {};
    if (!data.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Email pattern check
   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!data.email) {
  newErrors.email = "Email is required";
} else if (!emailPattern.test(data.email)) {
  newErrors.email = "Invalid email format (e.g., xyz@gmail.com)";
}

    // Password check
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (!passwordPattern.test(data.password)) {
      newErrors.password =
        "Password must be at least 6 characters, include letters & numbers";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post("https://localhost/api/auth/register", data);
      nav("/");
    } catch (err) {
      console.error(err);
      setErrors({ api: "Signup failed, please try again" });
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          placeholder="Email"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit">Signup</button>
        {errors.api && <p className="error">{errors.api}</p>}
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}
