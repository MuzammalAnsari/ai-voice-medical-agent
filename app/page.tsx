"use client";

import { motion } from "motion/react";
import { FeatureBentoGrid } from "./_components/FeatureBenToGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import {
  Mic,
  Brain,
  Stethoscope,
  Clock,
  Shield,
  Users,
  CheckCircle,
  Play,
  Star,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export default function MainSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Accuracy",
      description:
        "Advanced natural language processing specifically trained on medical terminology with 99.7% accuracy rate.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Transcription",
      description:
        "Instant voice-to-text conversion during patient consultations, saving hours of documentation time.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "HIPAA Compliant",
      description:
        "Enterprise-grade security ensuring patient data privacy and regulatory compliance at all times.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Language Support",
      description:
        "Supports 15+ languages with medical dialect recognition for diverse patient populations.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Voice Activation",
      description:
        "Simply speak during your patient consultation - our AI listens and understands medical context.",
    },
    {
      number: "02",
      title: "Smart Processing",
      description:
        "Advanced algorithms process speech, identify medical terms, and structure information intelligently.",
    },
    {
      number: "03",
      title: "Instant Documentation",
      description:
        "Receive formatted medical notes, prescriptions, and reports ready for your EHR system.",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Internal Medicine Physician",
      content:
        "This AI voice agent has revolutionized my practice. I save 2-3 hours daily on documentation.",
      rating: 5,
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Emergency Medicine",
      content:
        "The accuracy is incredible. It understands complex medical terminology better than any system I've used.",
      rating: 5,
    },
    {
      name: "Dr. Emily Thompson",
      role: "Family Medicine",
      content:
        "My patients love that I can focus on them instead of typing. It's transformed our conversations.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <Mic className="w-4 h-4 mr-2" />
                  AI-Powered Medical Documentation
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    {" "}
                    Medical Practice{" "}
                  </span>
                  with Voice AI
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Reduce documentation time by 80% with our HIPAA-compliant AI
                  voice agent. Focus on patients, not paperwork.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                  <Link href="/dashboard">Get Started</Link>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">99.7%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5,000+</div>
                  <div className="text-sm text-gray-600">
                    Healthcare Providers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">80%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500 ml-auto">
                      MedVoice AI Interface
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mic className="w-5 h-5 text-blue-600" />
                      <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full animate-pulse"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-gray-700">
                        "Patient presents with chest pain and shortness of
                        breath..."
                      </p>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          Cardiology
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Urgent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Brain className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Healthcare Professionals Choose MedVoice AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology designed specifically for medical
              professionals who demand accuracy, efficiency, and security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              How MedVoice AI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to transform your medical documentation
              workflow
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="text-5xl font-bold text-blue-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what doctors are saying about MedVoice AI
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Join thousands of healthcare professionals who have already
              revolutionized their documentation workflow. Start your free trial
              today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105">
                Start Free 30-Day Trial
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-blue-100 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                No Setup Fee
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cancel Anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                HIPAA Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">MedVoice AI</span>
              </div>
              <p className="text-gray-400">
                Transforming healthcare documentation with AI-powered voice
                technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MedVoice AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold">MedVoice AI</span>
      </div>
      {!user ? (
        <Link href="/sign-in">
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <UserButton />
          <Button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      )}
    </nav>
  );
};
