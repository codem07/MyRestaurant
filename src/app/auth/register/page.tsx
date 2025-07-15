"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/Input";
import Icon from "@/components/AppIcon";
import Head from "next/head";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    if (result.success) {
      router.push("/");
    } else {
      setError(result.message || "");
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Register - RecipeMaster</title>
        <meta name="description" content="Create your RecipeMaster account" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Icon name="ChefHat" size={40} color="var(--color-primary)" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Get Started</h1>
              <p className="text-muted-foreground mt-2">
                Create your RecipeMaster account and start managing your restaurant
              </p>
            </div>
            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                  <span className="text-sm text-error">{error}</span>
                </div>
              </div>
            )}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="restaurantName" className="block text-sm font-medium text-foreground mb-2">
                  Restaurant Name
                </label>
                <Input
                  id="restaurantName"
                  name="restaurantName"
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  placeholder="The Golden Spoon"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                    Restaurant Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State"
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/auth/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; 