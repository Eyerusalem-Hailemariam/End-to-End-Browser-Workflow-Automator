import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";
import { useRouter } from "next/router";


export default function LoginPage() {
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error || "An unknown error occurred.");
      }

      const { accessToken, refreshToken } = await response.json();
      console.log("Tokens received:", { accessToken, refreshToken });

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Access Token Stored:", localStorage.getItem("accessToken"));
      console.log(
        "Refresh Token Stored:",
        localStorage.getItem("refreshToken")
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during login:", error.message || error);
      setError(error.message || "An unknown error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
      <img
        src="/Decore.svg"
        alt="Decoration"
        className="absolute top-0 right-0 z-0 max-w-[600px] sm:max-w-[900px]"
      />
      <div className="flex w-full max-w-sm flex-col gap-6 z-20">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <LoginForm
          className="w-full"
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.elements.email.value;
            const password = e.target.elements.password.value;
            if (email && password) {
              handleLogin(email, password);
            } else {
              setError("Email and password are required.");
            }
          }}
        />
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
