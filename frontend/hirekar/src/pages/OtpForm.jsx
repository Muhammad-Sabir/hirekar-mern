import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const OtpForm = () => {
  const navigate = useNavigate();
  const { userType } = useParams();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const validEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const { email } = formData;

    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setError("");
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, otp } = formData;

    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      return;
    }

    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setError("");
        //console.log("USER is Verified")
        navigate(`/login/${userType}`);
      } else {
        setError(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    const { email } = formData;

    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setError("OTP resent to your email.");
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md p-8 text-center bg-white bg-opacity-75 rounded-lg shadow-lg w-96">
        <h1 className="mb-4 text-3xl font-bold text-custom-red">
          Verify Email
        </h1>
        {!otpSent && (
          <div>
            <p className="text-gray-600">Enter your email to receive OTP:</p>
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
              >
                Send OTP
              </button>
              {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
          </div>
        )}
        {otpSent && (
          <div>
            <p className="text-gray-600">
              OTP has been sent to your email. Enter the OTP to verify:
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
              >
                Verify
              </button>
              <p className="mt-2 text-gray-600">
                <button
                  type="button"
                  className="text-blue-600 underline"
                  onClick={handleResendOTP}
                >
                  Resend OTP
                </button>
              </p>
              {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpForm;
