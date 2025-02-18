import { useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { LucideLoader, LucideLogIn } from "lucide-react";
import { login, updateUserRole } from "@/redux/reducers/userSlice";
import OAuth from "./OAuth/OAuth";

const GoogleButton = ({ loading, role }) => {
  if (loading) {
    return (
      <Button
        variant="outline"
        className="w-full bg-white text-black border-gray-300 hover:bg-gray-50 h-11 px-8"
        disabled
      >
        <LucideLoader className="animate-spin mr-2 h-4 w-4" />
        <span>Connecting...</span>
      </Button>
    );
  }
  
  // Use the OAuth component instead of a custom button
  return <OAuth role={role} />;
};

const LeftSection = () => (
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
);

const EditorFormInputs = ({ isSignup, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        className="w-full h-11"
        disabled={loading}
      >
        {loading ? (
          <>
            <LucideLoader className="animate-spin mr-2 h-4 w-4" />
            <span>{isSignup ? "Creating Account..." : "Signing In..."}</span>
          </>
        ) : (
          <>
            <LucideLogIn className="mr-2 h-4 w-4" />
            {isSignup ? "Create Account" : "Sign In"}
          </>
        )}
      </Button>
    </form>
  );
};

const FooterContent = ({ role, isSignup, onToggleSignup }) => (
  <div className="flex flex-col w-full space-y-4">
    <Separator />
    <div className="pt-2">
      <Button
        variant="link"
        onClick={onToggleSignup}
        className="p-0 h-auto text-sm text-gray-600 hover:text-gray-900"
      >
        {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </Button>
    </div>
    <div className="text-xs text-gray-500 text-center">
      By continuing, you agree to our Terms of Service and Privacy Policy.
    </div>
  </div>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setLocalRole] = useState("creator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  const requestInProgress = useRef(false);
  const axiosSource = useRef(null);

  const handleRoleToggle = useCallback(
    (newRole) => {
      setLocalRole(newRole);
      dispatch(updateUserRole(newRole));
      setError(null);
    },
    [dispatch]
  );

  const handleEditorSubmit = useCallback(
    async (formData) => {
      if (requestInProgress.current) return;

      if (!formData.email || !formData.password) {
        setError("Please fill all required fields");
        return;
      }

      try {
        requestInProgress.current = true;
        setLoading(true);
        setError(null);

        if (axiosSource.current) {
          axiosSource.current.cancel("Operation canceled due to new request.");
        }

        axiosSource.current = axios.CancelToken.source();

        const endpoint = isSignup ? "api/auth/signup" : "api/auth/login";
        const response = await axios.post(
          `http://localhost:3000/${endpoint}`,
          { ...formData, role },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
            cancelToken: axiosSource.current.token,
          }
        );

        if (response.data.success === false) {
          setError(response.data.message);
          return;
        }

        const userData = {
          user: {
            email: formData.email,
            name: formData.name || "User",
          },
          role,
          googleToken: response.data.token || "",
        };

        dispatch(login(userData));
        navigate(role === "editor" ? "/editor/home" : "/");
      } catch (e) {
        if (!axios.isCancel(e)) {
          const errorMessage = e.response?.data?.message || e.message;
          setError(`Error: ${errorMessage}`);
        }
      } finally {
        requestInProgress.current = false;
        setLoading(false);
        axiosSource.current = null;
      }
    },
    [isSignup, role, navigate, dispatch]
  );

  const toggleSignup = useCallback(() => {
    setIsSignup((prev) => !prev);
    setError(null);
  }, []);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LeftSection />

      <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 bg-gray-50/50">
        <Card className="w-full max-w-md shadow-lg border-0 transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-medium">
              {isSignup ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignup
                ? "Join our creative community today"
                : "Sign in to your account"}
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
                  className="transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-100"
                >
                  Creator
                </TabsTrigger>
                <TabsTrigger
                  value="editor"
                  className="transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white hover:bg-gray-100"
                >
                  Editor
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="creator">
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 text-center">
                      Sign in with Google to manage your videos
                    </p>
                    <GoogleButton loading={loading} role={role} />
                  </div>
                </TabsContent>

                <TabsContent value="editor">
                  <EditorFormInputs
                    isSignup={isSignup}
                    onSubmit={handleEditorSubmit}
                    loading={loading}
                  />
                </TabsContent>
              </div>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <FooterContent
              role={role}
              isSignup={isSignup}
              onToggleSignup={toggleSignup}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;