import React, { useState } from "react";
import type { ChangeEvent } from "react";

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
        const resp = await response.text()
        const { code } = JSON.parse(resp)

        if (code === "duplicate_parameter") {
          throw new Error("Email already exists");
        }

        throw new Error("An error occurred while signing up. Please try again.");
      }
      setStatus("signed-up");
      setError(null);
    } catch (err) {
      const message = err instanceof Error ?
        err.message.includes("Email already exists") ?
          "This email is already registered." :
          "An error occurred while signing up. Please try again." :
        "An error occurred while signing up. Please try again.";
      setError(message);
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
    return <div className="text-center italic text-red-600">{error}</div>;
  }

  if (status === "finished") {
    return <div className="text-center italic text-green-600">Thank you for signing up!</div>;
  }

  return (
    <>
      {status === "signed-up" && (
        <p className="text-center">
          Thank you for signing up! Would you like to add any additional
          information?
        </p>
      )}
      <div
        className="
          flex flex-col items-center w-full max-w-[400px] mx-auto gap-2.5
          sm:flex-row
        "
      >
        {status === "waiting" && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              aria-label="Email address"
              className="w-4/5 p-2.5 border border-gray-300 rounded bg-background-50"
            />
            <button
              onClick={handleSignUp}
              className="
                px-5 py-2.5 bg-primary-500 text-white rounded
                hover:bg-primary-600 transition-colors
                min-w-fit w-fit cursor-pointer
              "
            >
              Sign Up
            </button>
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
              className="w-4/5 p-2.5 border border-gray-300 rounded bg-background-50"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              aria-label="Last name"
              className="w-4/5 p-2.5 border border-gray-300 rounded bg-background-50"
            />
            <button
              onClick={handleAdditionalInfo}
              className="
                px-5 py-2.5 bg-primary-500 text-white rounded
                hover:bg-primary-600 transition-colors
                min-w-fit w-fit cursor-pointer
              "
            >
              Submit
            </button>
          </>
        )}
      </div>
      {message && <div className="text-center italic text-red-500">{message}</div>}
    </>
  );
};

export default SignUp;