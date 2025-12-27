import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

const provider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Email & Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (email === "harigudipati666@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");

    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;

      if (userEmail === "harigudipati666@gmail.com") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-900">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4")'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl animate-fade-up mx-4">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to continue to your dashboard</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <span>•</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Or</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-3"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="mt-8 text-center space-y-2">
          <Link to="/reset" className="block text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            Forgot your password?
          </Link>
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
