// src/pages/Login/Login.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/common/Button/Button';
import { Input } from '../../components/common/Input/Input';
import { Card, CardContent } from '../../components/common/Card/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      // Redirect logic here
    }, 1500);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-[var(--color-primary)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#2D5A27]/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl" />

          {/* Logo */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2D5A27] text-white shadow-lg shadow-[#2D5A27]/20">
                <span className="text-2xl">🏠</span>
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-[#2D5A27]">Smart</span>
                  <span className="text-[#0F172A]">GharJagga</span>
                </span>
                <p className="text-[10px] font-medium text-[#94A3B8] tracking-wider uppercase">
                  Sign in to your account
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={fadeInUp}>
            <Card variant="elevated" padding="lg" className="border border-[var(--color-primary-border)]">
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Welcome Text */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                      Welcome Back! 👋
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                      Please enter your details to sign in
                    </p>
                  </div>

                  {/* Email Input */}
                  <div>
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      }
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="focus:outline-none"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      }
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--color-primary-border)] text-[#2D5A27] focus:ring-[#2D5A27] focus:ring-offset-0"
                      />
                      <span className="text-sm text-[var(--color-text-secondary)]">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-[#2D5A27] hover:text-[#23461E] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    className="font-semibold"
                  >
                    Sign In
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--color-primary-border)]" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-[var(--color-text-tertiary)]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-primary-border)] rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-200"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Google</span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-primary-border)] rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-sm font-medium text-[var(--color-text-primary)]">Facebook</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-[var(--color-text-secondary)]">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-[#2D5A27] hover:text-[#23461E] transition-colors"
                    >
                      Sign up now
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            variants={fadeInUp}
            className="mt-6 text-center bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[var(--color-primary-border)]"
          >
            <p className="text-xs text-[var(--color-text-tertiary)]">
              🎯 Demo Credentials
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-[var(--color-text-secondary)] mt-1">
              <span>Email: <span className="font-medium">demo@smartgharjagga.com</span></span>
              <span>Password: <span className="font-medium">demo123</span></span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;