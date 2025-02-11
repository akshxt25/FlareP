import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "173852556484-3c302oeh2nqs108mqhn936f8sn5m6fs7.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload";

const OAuth = ({ role }) => {
    const [user, setUser] = useState(null);
    const [tokenClient, setTokenClient] = useState(null);
    const navigate = useNavigate();

    const onGoogleClientLoad = async () => {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response) => {
                const accessToken = response.access_token;
                const userDetails = await fetchUserDetails(accessToken);
                setUser({ ...userDetails, accessToken });
                await callBackend(role, userDetails, accessToken);
            },
        });

        setTokenClient(client);
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
            document.body.removeChild(script);
        };
    }, [role]);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const fetchUserDetails = async (token) => {
        try {
            console.log("Fetching user details...");
            const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
            return await res.json();
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            return null;
        }
    };

    const callBackend = async (role, userDetails, accessToken) => {
        try {
            console.log("role", role);
            const response = await fetch("http://localhost:3000/api/auth/loginwithgoogle", {
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
            navigate("/");
        } catch (error) {
            console.error("Error calling backend:", error);
        }
    };

    const handleGoogleClick = () => {
        if (tokenClient) {
            console.log("Requesting Google Access Token...");
            tokenClient.requestAccessToken();
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 flex-1"
        >
            Continue With Google
        </button>
    );
};

export default OAuth;
