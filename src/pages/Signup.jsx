import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, ArrowRight } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        mobile,
        address,
        createdAt: new Date(),
      });

      // Signup success toast
      setShowToast(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(err.message);
      }
    }
  };

  const InputField = ({ icon: Icon, type, placeholder, value, onChange }) => (
    <div className="relative group">
      <input
        type={type}
        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex flex-[1.2] relative bg-slate-900 animate-slide-left">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1515168833906-d2a3b82b302a")' }}
        ></div>
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-16 text-white">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Join Our <br />Community</h1>
          <p className="text-xl text-slate-200 max-w-md leading-relaxed">
            Create an account today to unlock exclusive features, manage orders, and experience seamless shopping.
          </p>
          <div className="mt-12 flex gap-4">
            <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white animate-slide-right overflow-y-auto">
        <div className="w-full max-w-lg space-y-8 py-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Enter your details to get started</p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <span>•</span> {error}
            </div>
          )}

          {showToast && (
            <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-xl animate-fade-up flex items-center gap-3">
              <div className="bg-white/20 p-1 rounded-full"><ArrowRight size={16} /></div>
              <div>
                <p className="font-bold">Success!</p>
                <p className="text-sm text-emerald-100">Redirecting to login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5 animate-fade-up" style={{ animationDelay: '0.2s' }}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField icon={User} type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <InputField icon={Phone} type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>

            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="relative group">
              <textarea
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 min-h-[80px] resize-none"
                placeholder="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <MapPin className="absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                  placeholder="Confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
