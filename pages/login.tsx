"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouter() in App Router
import Image from 'next/image';
import "antd/dist/reset.css";
import { Form, Input, Button, message, Checkbox } from "antd";
import "../components/login.css";
import Logo from "../src/img/Prime Ceylon Logo.jpeg";

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
      router.push("/admin/dashboard"); // Redirect to admin dashboard
    } else {
      message.error("Invalid email or password");
    }
    setLoading(false);
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
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
            src={Logo}
            alt="Login Illustration"
            width={800}
            height={600}
            priority
          />
        </div>
      </div>
    </div>
  );
}