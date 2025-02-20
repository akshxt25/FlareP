import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/redux/reducers/userSlice"; // Updated import path based on your structure

const CLIENT_ID = "173852556484-3c302oeh2nqs108mqhn936f8sn5m6fs7.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload";

const OAuth = ({ role, onLoginStart, onLoginSuccess, onLoginError }) => {
    const [tokenClient, setTokenClient] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSuccessfulLogin = async (userData) => {
        console.log("1. Starting handleSuccessfulLogin with userData:", userData);
        try {
            await dispatch(login(userData));
            console.log("2. After dispatch, role is:", role);
            
            if (role === "creator") {
                console.log("3. Navigating to creator/home");
                navigate("/creator/home", { replace: true });
            } else if (role === "editor") {
                console.log("3. Navigating to editor/home");
                navigate("/editor/home", { replace: true });
            }
            
            onLoginSuccess?.();
        } catch (error) {
            console.log("Error in handleSuccessfulLogin:", error);
            onLoginError?.(error.message);
        }
    };

    const onGoogleClientLoad = async () => {
        if (!window.google || !window.google.accounts) {
            console.error("Google API is not loaded yet.");
            return;
        }
        
        const client = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response) => {
                let userDetailsData = null;
                let loginSuccessStatus = false;

                if (response.error) {
                    onLoginError?.(response.error);
                    return;
                }

                try {
                    onLoginStart?.();
                    
                    const accessToken = response.access_token;
                    userDetailsData = await fetchUserDetails(accessToken);
    
                    if (userDetailsData) {
                        loginSuccessStatus = await callBackend(role, userDetailsData, accessToken);
                        
                        if (loginSuccessStatus) {
                            const userData = {
                                user: {
                                    email: userDetailsData.email,
                                    name: userDetailsData.name,
                                },
                                role,
                                googleToken: accessToken,
                            };

                            await handleSuccessfulLogin(userData);
                        } else {
                            onLoginError?.("Backend login failed");
                        }
                    }
                } catch (error) {
                    onLoginError?.(error.message);
                } finally {
                    if (!userDetailsData || !loginSuccessStatus) {
                        onLoginStart?.(false); // Stop loading if login failed
                    }
                }
            },
        });
    
        setTokenClient(client);
    };

    const fetchUserDetails = async (token) => {
        try {
            const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            return await res.json();
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            return null;
        }
    };

    const callBackend = async (role, userDetails, accessToken) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/loginwithGoogle", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userDetails.email,
                    fullName: userDetails.name,
                    role: role,
                }),
            });

            const data = await response.json();
            console.log("Backend response:", data);
            
            return data.success;
        } catch (error) {
            console.error("Error calling backend:", error);
            return false;
        }
    };

    useEffect(() => {
        if (window.google && window.google.accounts) {
            onGoogleClientLoad();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = onGoogleClientLoad;

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [role]);

    const handleGoogleClick = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken();
        }
    };

    return (
        <div className="flex items-center justify-center">
            <button
                onClick={handleGoogleClick}
                type="button"
                className="bg-black text-white p-3 rounded-lg uppercase hover:opacity-95 flex-1"
            >
                Continue With Google
            </button>
        </div>
    );
};

export default OAuth;