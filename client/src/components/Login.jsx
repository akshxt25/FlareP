import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ 
    role: "creator",
    email: "",
    password: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRoleToggle = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setError(null);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === "editor" && (!formData.email || !formData.password)) {
      setError("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      window.location.href = "/";
    } catch (e) {
      setError("Error while calling backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Section */}
      <div className="w-1/2 h-full bg-black text-white flex flex-col justify-between p-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative space-y-4">
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FlarePP
          </h1>
          <p className="text-gray-400 text-lg">Your creative journey starts here</p>
        </div>

        <div className="relative space-y-6">
          <p className="text-3xl font-light leading-relaxed bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            INTERACT AND UPLOAD YOUR YOUTUBE VIDEOS SEAMLESSLY.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Your gateway to secure and seamless video uploading
              </p>
            </div>

            {/* Role Toggle */}
            <div className="space-y-2 mb-6">
              <label className="text-sm font-medium text-gray-700">Select your role</label>
              <div className="flex gap-2 p-1 rounded-lg bg-gray-100/80 backdrop-blur-sm">
                <button
                  onClick={() => handleRoleToggle("creator")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    formData.role === "creator"
                      ? "bg-black text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Creator
                </button>
                <button
                  onClick={() => handleRoleToggle("editor")}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                    formData.role === "editor"
                      ? "bg-black text-white shadow-md"
                      : "bg-transparent text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Editor
                </button>
              </div>
            </div>

            <div className="overflow-hidden transition-all duration-500 ease-in-out" 
                 style={{ 
                   maxHeight: formData.role === "editor" ? "400px" : "0",
                   opacity: formData.role === "editor" ? "1" : "0",
                   marginBottom: formData.role === "editor" ? "1.5rem" : "0"
                 }}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5 transform transition-all duration-500 ease-in-out translate-y-0">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 transition-all outline-none text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-1.5 transform transition-all duration-500 ease-in-out translate-y-0">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 transition-all outline-none text-sm"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-[1.02] hover:bg-gray-900 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 text-sm">
                    or continue with
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-gray-700 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:border-gray-300 disabled:opacity-70 disabled:hover:scale-100"
            >
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-black-icon.png"
                alt="Google"
                className="w-4 h-4 mr-3"
              />
              <span className="font-medium text-sm">Sign in with Google</span>
            </button>

            {error && (
              <div className="mt-4 text-sm text-red-500 text-center animate-bounce">
                {error}
              </div>
            )}

            <p className="mt-6 text-xs text-gray-500 text-center">
              By clicking continue, you agree to our{" "}
              <button className="font-medium text-gray-700 hover:text-black transition-colors">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="font-medium text-gray-700 hover:text-black transition-colors">
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;