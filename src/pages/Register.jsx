import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import posthog from "posthog-js";
import LampContainer from "../components/ui/lamp-effect";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useRegisterUserMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setemail] = useState("");
  const [showError, setShowError] = useState(false);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        name: userName,
        email,
        password,
      };

      const res = await registerUser(userData).unwrap();
      dispatch(setCredentials(res));
      posthog.identify(res.user._id, { username: res.user.name });
      posthog.capture("user_registered", { username: res.user.name });

      navigate("/upload-image");
    } catch (err) {
      console.error("Registration error:", err);
      setShowError(true);
    }
  };

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen flex md:flex-row flex-col items-center bg-slate-950 justify-center">
      <LampContainer className="w-full md:w-1/2">
        <div className="mt-4">
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-transparent"
          >
            Signup to <br /> MyTaskBuddy
          </motion.h1>
        </div>
      </LampContainer>

      <div className="w-full md:w-1/2 flex justify-center items-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700"
        >
          <div className="mb-4">
            <label className="block mb-2 text-lg text-white font-semibold" htmlFor="email">
              Email
            </label>
            <Input
              className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-lg text-white font-semibold" htmlFor="username">
              Username
            </label>
            <Input
              className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg text-white font-semibold" htmlFor="password">
              Password
            </label>
            <Input
              className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {showError && (
            <p className="text-red-500 text-sm">Registration failed</p>
          )}

          <button
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          <p className="mt-4 text-center text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              <i> Login </i>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;