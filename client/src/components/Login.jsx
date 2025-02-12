import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LucideLoader, LucideChevronRight, LucideArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    role: "creator",
    email: "",
    password: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

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

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      window.location.href = "http://localhost:3000/api/auth/google";
    } catch (e) {
      setError("Failed to connect with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const endpoint = isSignup ? "api/auth/signup" : "api/auth/login";
      const response = await axios.post(`http://localhost:3000/${endpoint}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      if (response.data.success === false) {
        setError(response.data.message);
        return;
      }

      if (formData.role === "editor" && !isSignup) {
        navigate("/Home");
      } else {
        navigate("/");
      }
    } catch (e) {
      setError(`Error: ${e.response?.data?.message || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(64,64,64,0.5)_0%,_transparent_70%)]" />
        
        <div className="relative space-y-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            FlarePP
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Your creative journey starts here
          </p>
        </div>

        <div className="relative space-y-6 z-10">
          <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed">
            INTERACT AND UPLOAD YOUR YOUTUBE VIDEOS SEAMLESSLY.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50/50">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-medium">
              {isSignup ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignup ? "Join our creative community today" : "Sign in to your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs 
              defaultValue="creator" 
              onValueChange={handleRoleToggle}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="creator"
                  className="transition-colors duration-300 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Creator
                </TabsTrigger>
                <TabsTrigger 
                  value="editor"
                  className="transition-colors duration-300 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Editor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="creator" className="mt-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    Sign in with Google to manage your videos
                  </p>
                  <Button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 transition-colors duration-300"
                  >
                    {loading ? (
                      <>
                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <img
                          src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-white-icon.png"
                          alt="Google"
                          className="w-4 h-4 mr-2"
                        />
                        Continue with Google
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="editor" className="mt-6">
                <form onSubmit={handleEditorSubmit} className="space-y-4">
                  {isSignup && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="transition-all duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="transition-all duration-300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="transition-all duration-300"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-900 transition-colors duration-300"
                  >
                    {loading ? (
                      <>
                        <LucideLoader className="mr-2 h-4 w-4 animate-spin" />
                        {isSignup ? "Creating account..." : "Signing in..."}
                      </>
                    ) : (
                      <>
                      
                        {isSignup ? "Sign up" : "Sign in"}
                        <LucideChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {formData.role === "editor" && (
              <Button 
                variant="link" 
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError(null);
                }}
                className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
              >
                {isSignup ? (
                  <span className="flex items-center">
                    <LucideArrowLeft className="mr-1 h-3 w-3" />
                    Already have an account? Sign in
                  </span>
                ) : (
                  <span className="flex items-center">
                    Don't have an account? Sign up
                    <LucideChevronRight className="ml-1 h-3 w-3" />
                  </span>
                )}
              </Button>
            )}
            
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our{" "}
              <Button variant="link" className="p-0 h-auto text-xs font-medium text-gray-700 hover:text-black transition-colors duration-300">
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button variant="link" className="p-0 h-auto text-xs font-medium text-gray-700 hover:text-black transition-colors duration-300">
                Privacy Policy
              </Button>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;