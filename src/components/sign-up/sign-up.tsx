import React, { useState } from "react";
import type { ChangeEvent } from "react";
import "./sign-up.scss";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
}

type SignUpStatus = "waiting" | "signed-up" | "finished";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [status, setStatus] = useState<SignUpStatus>("waiting");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    setError(null);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (): Promise<void> => {
    if (!validateEmail(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch("/api/register-interest/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to sign up: ${message}`);
      }
      setStatus("signed-up");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("An error occurred during sign up. Please try again.");
    }
  };

  const handleAdditionalInfo = async (): Promise<void> => {
    try {
      const response = await fetch("/api/register-interest/add-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Failed to update details: ${message}`);
      }
      setStatus("finished");
      setError(null);
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred while updating your information. Please try again.",
      );
    }
  };

  if (error) {
    return <div className="message error">{error}</div>;
  }

  if (status === "finished") {
    return <div className="message success">Thank you for signing up!</div>;
  }

  return (
    <>
      {status === "signed-up" && (
        <p>
          Thank you for signing up! Would you like to add any additional
          information?
        </p>
      )}
      <div className="signup-form">
        {status === "waiting" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              aria-label="Email address"
            />
            <button onClick={handleSignUp}>Sign Up</button>
          </>
        )}
        {status === "signed-up" && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              aria-label="First name"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              aria-label="Last name"
            />
            <button onClick={handleAdditionalInfo}>Submit</button>
          </>
        )}
      </div>
      {message && <div className="message">{message}</div>}
    </>
  );
};

export default SignUp;
