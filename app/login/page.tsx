"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../src/img/Propwise Logo No BG.png";
import "antd/dist/reset.css";
import { Form, Input, Button, message, Checkbox, Modal } from "antd";
import "../../components/login.css";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import Footer from "../../components/Footer";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure styles are loaded before rendering
  }, []);

  if (!isClient) return null;

  async function handleLogin(values: { email: string; password: string }) {
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      message.success("Login successful! Redirecting...");
      router.push("/admin/dashboard");
    } else {
      const errorData = await res.json();
      message.error(errorData?.message || "Invalid email or password");
      Modal.error({
        title: "Authentication Failed",
        content: "Invalid email or password. Please check your credentials and try again.",
        okText: "Got it!",
        centered: true,
      });
    }

    setLoading(false);
  }

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <header className="header">
        <div className="container">
        {/* Brand */}
          <div className="brand">
            <Image src={Logo} width={60} height={60} alt="Logo" className="logo-image" />
            <h1 className="title">PROPWISE</h1>
          </div>
        </div>
      </header>
      <div className="login-page">
        <div className="login-box">
          {/* Login Form */}
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            onFinishFailed={onFinishFailed}
          >
            <p className="form-title">Welcome back</p>
            <p>Login to the Dashboard</p>

            {/* Email Input */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Enter a valid email!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            {/* Password Input */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            {/* Remember Me Checkbox */}
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={loading}
                block
              >
                Login
              </Button>
            </Form.Item>

            {/* Redirect Button */}
            <Button type="default" onClick={() => router.push("/")} block>
              Go back to Listings
            </Button>
          </Form>

          {/* Illustration Image */}
          <div className="illustration-wrapper">
            <Image
              src="/img/PropwiseLogo.jpg"
              alt="Login Illustration"
              width={900}
              height={600}
              priority
            />
          </div>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", zIndex: 1000 }}>
        <Footer />
      </div>
    </>
  );
}