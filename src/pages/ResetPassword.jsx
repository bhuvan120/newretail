import { useState } from "react";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      // ✅ Check if email exists in Firebase Auth
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length === 0) {
        // ❌ Email NOT registered
        setError("Email not found. Redirecting to signup...");

        setTimeout(() => {
          navigate("/signup");
        }, 2000);

        return;
      }

      // ✅ Email exists → send reset link
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset email sent. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError("Something went wrong. Please try again.",err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-3">Reset Password</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {info && <div className="alert alert-success">{info}</div>}

            <form onSubmit={handleReset}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button className="btn btn-primary w-100">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
