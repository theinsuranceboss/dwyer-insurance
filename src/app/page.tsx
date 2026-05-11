"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield,
  Car,
  Home,
  Heart,
  Building2,
  Bike,
  Ship,
  TreePine,
  Umbrella,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Award,
  Users,
  Handshake,
  Lock,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Globe,
  Sparkles,
  ShieldCheck,
  FileText,
  LifeBuoy,
  Fingerprint,
  Wrench,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

// ─── Data Constants ────────────────────────────────────────────────

const AGENT = {
  name: "Suzanne Dwyer",
  title: "Allstate Insurance Agent",
  badge: "Elite Agent",
  phone: "(610) 725-9900",
  phoneLink: "tel:+16107259900",
  textNumber: "6107258137",
  email: "suzannedwyer@allstate.com",
  address: "Wynnewood, PA 19096",
  states: ["Pennsylvania", "New Jersey", "Delaware"],
  languages: ["English", "Spanish"],
  rating: 4.3,
  reviews: 273,
  hours: {
    "Mon-Fri": "8:30 AM – 5:00 PM",
    "Sat-Sun": "Closed",
    afterHours: "After-hours appointments available",
  },
  tagline: "You're in good hands®",
};

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Insurance", href: "#insurance" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const INSURANCE_TYPES = [
  {
    id: "auto",
    title: "Auto Insurance",
    icon: Car,
    color: "#0033A0",
    lightBg: "#e8edf5",
    tagline: "Protection for the road ahead",
    description:
      "Get comprehensive auto insurance coverage that protects you, your passengers, and your vehicle. From fender benders to major collisions, Allstate auto insurance has you covered with customizable policies tailored to your needs.",
    features: [
      "Liability coverage for bodily injury & property damage",
      "Collision coverage for vehicle damage",
      "Comprehensive coverage for non-collision events",
      "Uninsured/underinsured motorist protection",
      "Medical payments coverage",
      "Roadside assistance add-on",
      "Rental reimbursement coverage",
    ],
    tip: "Bundle auto with home insurance and save up to 25% on your premium!",
  },
  {
    id: "home",
    title: "Home Insurance",
    icon: Home,
    color: "#001e60",
    lightBg: "#e0e7f5",
    tagline: "Your home, your haven — we protect both",
    description:
      "Your home is likely your biggest investment. Allstate homeowners insurance helps protect your home and belongings against covered losses like fire, theft, and severe weather. Suzanne will help you find the right coverage at the right price.",
    features: [
      "Dwelling coverage for your home's structure",
      "Personal property protection",
      "Liability protection if someone is injured on your property",
      "Additional living expenses if your home is unlivable",
      "Other structures coverage (garages, sheds, fences)",
      "Medical payments to others",
      "Claim RateGuard® — your rate won't increase due to a claim",
    ],
    tip: "Ask about the Claim RateGuard® add-on to keep your rates from increasing after a claim.",
  },
  {
    id: "life",
    title: "Life Insurance",
    icon: Heart,
    color: "#c74e10",
    lightBg: "#fef3e8",
    tagline: "Secure your family's future today",
    description:
      "Life insurance provides financial protection for your loved ones when they need it most. Whether you're looking for term life, whole life, or universal life insurance, Suzanne can help you find a policy that fits your budget and provides peace of mind.",
    features: [
      "Term life insurance for affordable, temporary coverage",
      "Whole life insurance with cash value accumulation",
      "Universal life insurance with flexible premiums",
      "Convertible term policies",
      "Death benefit protection for your beneficiaries",
      "Tax-advantaged cash value growth",
      "Estate planning support",
    ],
    tip: "Term life insurance can be 5-15x more affordable than whole life — perfect for young families!",
  },
  {
    id: "renters",
    title: "Renters Insurance",
    icon: Building2,
    color: "#0e7490",
    lightBg: "#e6f7fa",
    tagline: "Your landlord's insurance won't cover your stuff",
    description:
      "Even if you don't own your home, your personal belongings still need protection. Renters insurance covers your possessions against theft, fire, and other covered perils — often for less than you might think.",
    features: [
      "Personal property coverage for belongings",
      "Liability protection if someone is injured in your home",
      "Additional living expenses if your rental is damaged",
      "Medical payments to others",
      "Coverage for theft, fire, vandalism, and more",
      "Off-premises theft coverage",
      "Affordable monthly premiums",
    ],
    tip: "Renters insurance can cost as little as $15-30/month — less than a streaming subscription!",
  },
  {
    id: "condo",
    title: "Condo Insurance",
    icon: Landmark,
    color: "#7c3aed",
    lightBg: "#f0e8ff",
    tagline: "Tailored coverage for condo living",
    description:
      "Condo insurance is different from homeowners insurance because your condo association's master policy covers the building's exterior and common areas. Suzanne will help you understand what's covered and fill in the gaps for your unit.",
    features: [
      "Coverage for interior walls and fixtures",
      "Personal property protection",
      "Liability coverage",
      "Loss assessment coverage for shared areas",
      "Additional living expenses",
      "Improvements and betterments coverage",
      "Medical payments to others",
    ],
    tip: "Review your condo association's master policy to understand exactly what you need to cover.",
  },
  {
    id: "motorcycle",
    title: "Motorcycle Insurance",
    icon: Bike,
    color: "#dc2626",
    lightBg: "#fef2f2",
    tagline: "Ride with confidence and protection",
    description:
      "Whether you ride a cruiser, sport bike, touring motorcycle, or scooter, Allstate motorcycle insurance provides the coverage you need. From liability to comprehensive protection, ride knowing you're covered.",
    features: [
      "Liability coverage for bodily injury & property damage",
      "Collision and comprehensive coverage",
      "Uninsured motorist protection",
      "Custom parts and equipment coverage",
      "Roadside assistance for motorcycles",
      "Guest passenger liability",
      "Multiple motorcycle discounts",
    ],
    tip: "Store your bike in the off-season? Ask about lay-up periods to reduce your premium.",
  },
  {
    id: "business",
    title: "Business Insurance",
    icon: BriefcaseIcon,
    color: "#059669",
    lightBg: "#ecfdf5",
    tagline: "Protect what you've built",
    description:
      "From small businesses to larger operations, Suzanne offers a range of commercial insurance solutions. Protect your business property, employees, and bottom line with customized coverage that grows with your business.",
    features: [
      "General liability insurance",
      "Commercial property insurance",
      "Business owner's policy (BOP)",
      "Workers' compensation",
      "Commercial auto insurance",
      "Professional liability / Errors & Omissions",
      "Cyber liability coverage",
    ],
    tip: "A Business Owner's Policy (BOP) bundles property and liability coverage at a reduced rate.",
  },
  {
    id: "boat",
    title: "Boat Insurance",
    icon: Ship,
    color: "#0284c7",
    lightBg: "#e8f4fd",
    tagline: "Smooth sailing, insured",
    description:
      "Enjoy the water with peace of mind. Allstate boat insurance covers your vessel, motor, trailer, and equipment against a wide range of risks, both on and off the water.",
    features: [
      "Physical damage coverage for your boat",
      "Liability protection on the water",
      "Medical payments coverage",
      "Uninsured watercraft coverage",
      "Personal effects coverage",
      "Emergency assistance & towing",
      "Wreck removal coverage",
    ],
    tip: "Many boat policies include discounts for completing boating safety courses.",
  },
  {
    id: "atv",
    title: "ATV / Off-Road Insurance",
    icon: TreePine,
    color: "#65a30d",
    lightBg: "#f0fce4",
    tagline: "Adventure protected, on and off the trail",
    description:
      "ATVs, UTVs, and off-road vehicles need specialized insurance. Whether you're hitting the trails or working the land, Suzanne can get you covered for the unexpected.",
    features: [
      "Collision and comprehensive coverage",
      "Liability protection",
      "Uninsured motorist coverage",
      "Custom parts and accessories coverage",
      "Medical payments",
      "Trailer coverage",
      "Multiple vehicle discounts",
    ],
    tip: "Some homeowners policies offer limited ATV coverage — but a dedicated policy provides full protection.",
  },
  {
    id: "flood",
    title: "Flood Insurance",
    icon: Umbrella,
    color: "#0d9488",
    lightBg: "#e6faf8",
    tagline: "Standard policies don't cover floods — we do",
    description:
      "Flooding is the most common and costly natural disaster in the U.S. — and it's not covered by standard homeowners insurance. Suzanne can help you get the flood protection you need through the National Flood Insurance Program (NFIP).",
    features: [
      "Building property coverage up to $250,000",
      "Personal property coverage up to $100,000",
      "Coverage for flood damage to your home's structure",
      "Protection for furnace, water heater, and appliances",
      "Coverage for debris removal",
      "NFIP-backed policies",
      "Preferred risk policies for low-to-moderate risk areas",
    ],
    tip: "There's typically a 30-day waiting period before a new flood policy takes effect — don't wait for storm season!",
  },
  {
    id: "identity",
    title: "Identity Protection",
    icon: Fingerprint,
    color: "#9333ea",
    lightBg: "#faf0ff",
    tagline: "Your identity, your fortress",
    description:
      "Identity theft can happen to anyone. Allstate Identity Protection monitors your personal information and helps you recover if your identity is compromised. Get proactive monitoring and expert restoration support.",
    features: [
      "Dark web monitoring for your personal information",
      "Social media account monitoring",
      "Credit monitoring and alerts",
      "Identity theft insurance up to $1 million",
      "Dedicated restoration specialists",
      "Lost wallet protection",
      "Financial account takeover monitoring",
    ],
    tip: "Over 14 million Americans were victims of identity theft last year — protect yourself proactively.",
  },
  {
    id: "roadside",
    title: "Roadside Assistance",
    icon: Wrench,
    color: "#ea580c",
    lightBg: "#fff5eb",
    tagline: "Help when you need it, 24/7",
    description:
      "Never get stranded again. Allstate Roadside Assistance provides 24/7 help for common roadside emergencies, from flat tires and dead batteries to lockouts and towing. Available as an add-on to your auto policy or as a standalone plan.",
    features: [
      "Towing service up to your coverage limit",
      "Jump-starts for dead batteries",
      "Flat tire changes",
      "Lockout service",
      "Fuel delivery",
      "24/7 nationwide coverage",
      "No deductible or copay",
    ],
    tip: "Good Hands Rescue® lets you request help with just a tap in the Allstate mobile app.",
  },
];

const TESTIMONIALS = [
  {
    name: "Jennifer T.",
    rating: 5,
    text: "Suzanne is absolutely wonderful! She took the time to explain all my options and helped me save money by bundling my policies. I couldn't be happier with the service!",
    date: "May 2025",
  },
  {
    name: "Keith M.",
    rating: 4.5,
    text: "Very professional and knowledgeable agent. Suzanne helped me find the right coverage for my home and auto. The claims process was smooth and hassle-free.",
    date: "May 2025",
  },
  {
    name: "Michael T.",
    rating: 5,
    text: "Outstanding service! Suzanne goes above and beyond for her clients. She's always available to answer questions and genuinely cares about getting you the best coverage.",
    date: "May 2025",
  },
  {
    name: "Moses B.",
    rating: 5,
    text: "I switched to Allstate because of Suzanne and I'm so glad I did. She found me better coverage at a lower price than my previous insurer. Highly recommend!",
    date: "April 2025",
  },
  {
    name: "Sarah K.",
    rating: 5,
    text: "Suzanne made the insurance process so easy to understand. She patiently answered all my questions and helped me choose the perfect policy for my family's needs.",
    date: "April 2025",
  },
  {
    name: "Robert L.",
    rating: 4.5,
    text: "Great experience working with Suzanne. She's responsive, thorough, and genuinely cares about her clients' well-being. My family has been with her for years.",
    date: "March 2025",
  },
];

const FAQS = [
  {
    q: "Can I text your agency with questions?",
    a: "Yes! We have text messaging services available. You can reach us at (610) 725-8137 for quick questions, policy updates, or to schedule an appointment.",
  },
  {
    q: "What languages do you speak?",
    a: "We have staff members available who speak English and Spanish. We're committed to serving our diverse community in their preferred language.",
  },
  {
    q: "What states are you licensed in?",
    a: "Suzanne Dwyer is insurance licensed in Delaware, New Jersey, and Pennsylvania. If you reside outside these states, we can help connect you with another Allstate agent.",
  },
  {
    q: "How can I save money on my insurance?",
    a: "We offer multiple discounts including multi-policy bundling (save up to 25%), safe driver discounts, claim-free discounts, good student discounts, and more. Contact us for a personalized quote and savings review.",
  },
  {
    q: "Do you offer virtual appointments?",
    a: "Yes! We offer both in-person and virtual appointments for your convenience. Schedule an appointment that works for you — evenings and weekends available by request.",
  },
  {
    q: "What happens after I file a claim?",
    a: "Once you file a claim, you'll be assigned a dedicated claims adjuster who will guide you through the process. Allstate's Claim Satisfaction Guarantee ensures you're happy with the outcome, or we'll make it right.",
  },
  {
    q: "How do I know if I need flood insurance?",
    a: "Flood damage is not covered by standard homeowners insurance. If you live in a flood zone or near water, flood insurance is essential. Even in low-risk areas, about 25% of flood claims come from outside high-risk zones. We can assess your risk and help you decide.",
  },
  {
    q: "Can I bundle different types of insurance?",
    a: "Absolutely! Bundling your policies (like auto + home) with Allstate can save you up to 25% on your premiums. We also offer multi-car discounts, safe driving bonuses, and loyalty rewards.",
  },
];

// ─── Helper Components ─────────────────────────────────────────────

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const { size = 24, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i - 0.5 <= rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-allstate-gray/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-allstate-blue flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={`font-bold text-lg leading-tight ${scrolled ? "text-allstate-navy" : "text-white"}`}>
                Suzanne Dwyer
              </p>
              <p className={`text-xs leading-tight ${scrolled ? "text-allstate-blue" : "text-allstate-light"}`}>
                Allstate Insurance Agent
              </p>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-allstate-navy hover:text-allstate-blue"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a href={AGENT.phoneLink}>
              <Button
                size="sm"
                className="bg-allstate-orange hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                Get a Quote
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={scrolled ? "text-allstate-navy" : "text-white"} size={24} />
            ) : (
              <Menu className={scrolled ? "text-allstate-navy" : "text-white"} size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-xl border-t border-allstate-gray/30"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-allstate-navy hover:bg-allstate-light/10 hover:text-allstate-blue rounded-lg transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
              <a href={AGENT.phoneLink} className="block pt-2">
                <Button className="w-full bg-allstate-orange hover:bg-orange-600 text-white font-semibold">
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote: {AGENT.phone}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      {/* Dark overlay with Allstate gradient */}
      <div className="absolute inset-0 bg-allstate-hero/85" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-72 h-72 bg-allstate-light/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-allstate-orange/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-allstate-blue/5 rounded-full blur-3xl"
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-allstate-orange/20 text-allstate-orange border-allstate-orange/30 mb-6 px-4 py-2 text-sm font-semibold">
                <Award className="w-4 h-4 mr-2" />
                Elite Agent — Allstate
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Suzanne Dwyer
              <span className="block text-gradient mt-2">Allstate Insurance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-white/80 max-w-lg"
            >
              Protecting what matters most to you in Wynnewood, PA and across Pennsylvania, New Jersey, and Delaware.
            </motion.p>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 flex items-center gap-3"
            >
              <StarRating rating={AGENT.rating} size={20} />
              <span className="text-white font-bold text-lg">{AGENT.rating}</span>
              <span className="text-white/60">|</span>
              <span className="text-allstate-light font-medium">{AGENT.reviews}+ Reviews</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <a href={AGENT.phoneLink}>
                <Button
                  size="lg"
                  className="bg-allstate-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call {AGENT.phone}
                </Button>
              </a>
              <a href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-allstate-light/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Get a Free Quote
                </Button>
              </a>
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Clock, label: "Mon–Fri", value: "8:30–5:00 PM" },
                { icon: Globe, label: "Languages", value: "EN / ES" },
                { icon: MapPin, label: "Serving", value: "PA, NJ, DE" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4 text-allstate-light" />
                  <div>
                    <p className="text-xs text-white/50">{item.label}</p>
                    <p className="text-sm font-medium text-white/90">{item.value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Insurance Cards Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Floating insurance cards */}
              {INSURANCE_TYPES.slice(0, 6).map((item, i) => (
                <motion.div
                  key={item.id}
                  animate={{
                    y: [0, -8, 0],
                    rotateZ: i % 2 === 0 ? [-1, 1, -1] : [1, -1, 1],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                  className="absolute glass rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    top: `${i * 80}px`,
                    left: `${i * 15 - 30}px`,
                    zIndex: 6 - i,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon size={24} style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-white/60 text-xs">{item.tagline}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/40" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── About Section ─────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image/Visual Side */}
          <AnimatedSection>
            <div className="relative">
              <div className="bg-allstate-gradient rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-allstate-light/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-allstate-orange/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-allstate-light bg-allstate-dark flex items-center justify-center mb-6 overflow-hidden">
                    <img
                      src="/agent-photo.png"
                      alt="Suzanne Dwyer - Allstate Insurance Agent"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Suzanne Dwyer</h3>
                  <p className="text-allstate-light font-medium text-lg mb-4">
                    Allstate Elite Agent
                  </p>
                  <p className="text-white/80 mb-6">
                    Dedicated to providing personalized insurance solutions with the backing of
                    Allstate&apos;s financial strength and claims expertise.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { number: "273+", label: "Happy Clients" },
                      { number: "4.3", label: "Star Rating" },
                      { number: "3", label: "States Licensed" },
                      { number: "12+", label: "Insurance Types" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm"
                      >
                        <p className="text-2xl font-bold text-allstate-light">{stat.number}</p>
                        <p className="text-sm text-white/70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-allstate-orange text-white rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-bold text-sm">Elite Agent</span>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection delay={0.2}>
            <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
              About Suzanne
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-6">
              Your Trusted Insurance
              <span className="text-allstate-blue"> Partner in Wynnewood</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              As an Allstate Elite Agent serving the Wynnewood community, Suzanne Dwyer brings
              dedication, expertise, and a personal touch to every client relationship. She
              understands that insurance isn&apos;t just about policies — it&apos;s about protecting
              the people and things that matter most to you.
            </p>
            <p className="text-muted-foreground mb-8">
              Whether you&apos;re purchasing your first home, starting a business, or looking to
              protect your family&apos;s future, Suzanne takes the time to understand your unique
              situation and find the right coverage at the right price. With in-person and virtual
              appointments available, getting the protection you need has never been easier.
            </p>

            <div className="space-y-4 mb-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Personalized Coverage",
                  desc: "Tailored insurance solutions, not one-size-fits-all policies",
                },
                {
                  icon: Clock,
                  title: "24/7 Support",
                  desc: "Round-the-clock claims support and after-hours appointments",
                },
                {
                  icon: Handshake,
                  title: "Trusted Partnership",
                  desc: "Building lasting relationships based on trust and transparency",
                },
                {
                  icon: Globe,
                  title: "Bilingual Service",
                  desc: "Serving clients in both English and Spanish",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-allstate-blue/10 flex items-center justify-center flex-shrink-0 group-hover:bg-allstate-blue/20 transition-colors">
                    <item.icon className="w-6 h-6 text-allstate-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact">
              <Button className="bg-allstate-blue hover:bg-allstate-navy text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all">
                Schedule a Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── Services Overview ─────────────────────────────────────────────

function ServicesSection() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-allstate-light-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            Comprehensive Insurance <span className="text-allstate-blue">Solutions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From auto and home to life and business, Suzanne Dwyer offers a full range of Allstate
            insurance products to protect every aspect of your life.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INSURANCE_TYPES.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.05}>
              <a href={`#insurance-${item.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-allstate-gray/30 h-full">
                  <CardHeader className="pb-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.lightBg }}
                    >
                      <item.icon size={28} style={{ color: item.color }} />
                    </div>
                    <CardTitle className="text-lg text-allstate-navy group-hover:text-allstate-blue transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-sm">
                      {item.tagline}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-allstate-blue font-medium text-sm group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Insurance Detail Sections ─────────────────────────────────────

function InsuranceDetailSections() {
  return (
    <section id="insurance" className="py-0">
      {INSURANCE_TYPES.map((item, index) => (
        <InsuranceDetail key={item.id} item={item} index={index} />
      ))}
    </section>
  );
}

function InsuranceDetail({
  item,
  index,
}: {
  item: (typeof INSURANCE_TYPES)[number];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      id={`insurance-${item.id}`}
      className={`py-16 lg:py-20 ${isEven ? "bg-white" : "bg-allstate-light-gradient"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Visual Side */}
          <AnimatedSection className={isEven ? "lg:order-1" : "lg:order-2"}>
            <div className="relative">
              <div
                className="rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                style={{ backgroundColor: `${item.color}10` }}
              >
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full -translate-y-1/2 translate-x-1/2"
                  style={{ backgroundColor: `${item.color}15` }}
                />
                <div
                  className="absolute bottom-0 left-0 w-32 h-32 rounded-full translate-y-1/2 -translate-x-1/2"
                  style={{ backgroundColor: `${item.color}10` }}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon size={40} className="text-white" />
                  </motion.div>

                  <h3
                    className="text-2xl lg:text-3xl font-bold mb-3"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-lg font-medium" style={{ color: `${item.color}cc` }}>
                    {item.tagline}
                  </p>

                  {/* Tip callout */}
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-8 rounded-2xl p-5 border-l-4"
                    style={{
                      backgroundColor: `${item.color}08`,
                      borderColor: item.color,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles
                        size={20}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: item.color }}
                      />
                      <p className="text-sm font-medium" style={{ color: `${item.color}dd` }}>
                        {item.tip}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Content Side */}
          <AnimatedSection
            delay={0.2}
            className={isEven ? "lg:order-2" : "lg:order-1"}
          >
            <Badge
              className="mb-4"
              style={{
                backgroundColor: `${item.color}15`,
                color: item.color,
                borderColor: `${item.color}30`,
              }}
            >
              {item.title}
            </Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-allstate-navy mb-4">
              {item.tagline}
            </h3>
            <p className="text-muted-foreground text-lg mb-8">{item.description}</p>

            <div className="space-y-3 mb-8">
              {item.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: item.color }}
                  />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href={AGENT.phoneLink}>
                <Button
                  className="font-semibold shadow-lg hover:shadow-xl transition-all text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Get a Quote
                </Button>
              </a>
              <a href="#contact">
                <Button
                  variant="outline"
                  className="font-semibold"
                  style={{ borderColor: `${item.color}50`, color: item.color }}
                >
                  Contact Suzanne
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

// ─── Why Choose Us ─────────────────────────────────────────────────

function WhyChooseUsSection() {
  const reasons = [
    {
      icon: Award,
      title: "Elite Agent Status",
      description:
        "Suzanne has earned Allstate's Elite Agent designation, recognizing exceptional service and client satisfaction year after year.",
    },
    {
      icon: Users,
      title: "273+ Satisfied Clients",
      description:
        "With a 4.3-star rating from over 273 reviews, our clients consistently praise Suzanne's dedication and expertise.",
    },
    {
      icon: Handshake,
      title: "Personal Relationship",
      description:
        "You're not just a policy number. Suzanne builds lasting relationships, understanding your evolving needs and adjusting coverage accordingly.",
    },
    {
      icon: Lock,
      title: "Allstate Financial Strength",
      description:
        "Backed by Allstate's financial strength and claims-paying ability, you can trust your coverage will be there when you need it most.",
    },
    {
      icon: LifeBuoy,
      title: "24/7 Claims Support",
      description:
        "File a claim anytime, day or night. Allstate's 24/7 claims support means help is always just a phone call away.",
    },
    {
      icon: FileText,
      title: "Multi-Policy Discounts",
      description:
        "Save up to 25% when you bundle auto and home insurance. More coverage, more savings, one trusted agent.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-allstate-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(87,182,255,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,158,22,0.3) 0%, transparent 50%)",
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <Badge className="bg-white/10 text-allstate-light border-white/20 mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Families Trust <span className="text-gradient">Suzanne Dwyer</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Choosing the right insurance agent makes all the difference. Here&apos;s why hundreds of
            families trust Suzanne with their protection.
          </p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <AnimatedSection key={reason.title} delay={i * 0.08}>
              <Card className="bg-white/10 backdrop-blur-md border-white/10 text-white hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-allstate-light/20 flex items-center justify-center mb-3">
                    <reason.icon className="w-7 h-7 text-allstate-light" />
                  </div>
                  <CardTitle className="text-white text-lg">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-sm">{reason.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            What Our Clients <span className="text-allstate-blue">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it — hear from the families and individuals who trust
            Suzanne Dwyer with their insurance needs.
          </p>
        </AnimatedSection>

        {/* Featured testimonial */}
        <AnimatedSection className="mb-12">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <StarRating rating={TESTIMONIALS[activeIndex].rating} size={24} />
                </div>
                <blockquote className="text-xl lg:text-2xl text-allstate-navy font-medium leading-relaxed mb-6">
                  &ldquo;{TESTIMONIALS[activeIndex].text}&rdquo;
                </blockquote>
                <p className="font-semibold text-allstate-blue text-lg">
                  {TESTIMONIALS[activeIndex].name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {TESTIMONIALS[activeIndex].date}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === activeIndex
                      ? "bg-allstate-blue w-8"
                      : "bg-allstate-gray hover:bg-allstate-blue/30"
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Review cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pr-2">
          {TESTIMONIALS.map((review, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <Card className="h-full border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} size={14} />
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-4">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-allstate-blue/10 flex items-center justify-center">
                      <span className="text-allstate-blue font-bold text-sm">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-sm text-allstate-navy">{review.name}</span>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ───────────────────────────────────────────────────

function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-allstate-light-gradient">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            Frequently Asked <span className="text-allstate-blue">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Have questions? We have answers. If you don&apos;t see what you&apos;re looking for,
            feel free to contact us directly.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-white rounded-xl border border-allstate-gray/30 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-allstate-navy font-semibold hover:text-allstate-blue hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Contact Section ───────────────────────────────────────────────

function ContactSection() {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    insuranceType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. Suzanne will get back to you shortly.",
      });
      setFormState({ name: "", email: "", phone: "", insuranceType: "", message: "" });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try calling us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <Badge className="bg-allstate-blue/10 text-allstate-blue border-allstate-blue/20 mb-4">
            Contact Us
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-allstate-navy mb-4">
            Get in <span className="text-allstate-blue">Touch</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Ready to protect what matters most? Contact Suzanne today for a free, no-obligation
            insurance consultation and quote.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <AnimatedSection>
            <Card className="border-allstate-gray/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-allstate-navy">Request a Free Quote</CardTitle>
                <CardDescription>
                  Fill out the form below and Suzanne will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, name: e.target.value }))
                        }
                        className="border-allstate-gray/50 focus:border-allstate-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, email: e.target.value }))
                        }
                        className="border-allstate-gray/50 focus:border-allstate-blue"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, phone: e.target.value }))
                        }
                        className="border-allstate-gray/50 focus:border-allstate-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceType">Insurance Type</Label>
                      <select
                        id="insuranceType"
                        value={formState.insuranceType}
                        onChange={(e) =>
                          setFormState((s) => ({ ...s, insuranceType: e.target.value }))
                        }
                        className="flex h-10 w-full rounded-md border border-allstate-gray/50 bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-allstate-blue focus-visible:ring-offset-2"
                      >
                        <option value="">Select a type...</option>
                        {INSURANCE_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your insurance needs..."
                      rows={4}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, message: e.target.value }))
                      }
                      className="border-allstate-gray/50 focus:border-allstate-blue"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-allstate-blue hover:bg-allstate-navy text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              {/* Phone Card */}
              <Card className="border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-allstate-blue/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-7 h-7 text-allstate-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">Call Us</h4>
                    <a
                      href={AGENT.phoneLink}
                      className="text-allstate-blue font-bold text-lg hover:underline"
                    >
                      {AGENT.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">24/7 Support Available</p>
                  </div>
                </CardContent>
              </Card>

              {/* Text Card */}
              <Card className="border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">Text Us</h4>
                    <a
                      href={`sms:${AGENT.textNumber}`}
                      className="text-green-600 font-bold text-lg hover:underline"
                    >
                      {AGENT.textNumber}
                    </a>
                    <p className="text-sm text-muted-foreground">Quick questions welcome</p>
                  </div>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-7 h-7 text-allstate-orange" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">Email Us</h4>
                    <a
                      href={`mailto:${AGENT.email}`}
                      className="text-allstate-orange font-bold hover:underline break-all"
                    >
                      {AGENT.email}
                    </a>
                    <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-7 h-7 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">Visit Us</h4>
                    <p className="text-allstate-navy font-medium">{AGENT.address}</p>
                    <p className="text-sm text-muted-foreground">
                      Serving {AGENT.states.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Hours Card */}
              <Card className="border-allstate-gray/30 hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-allstate-navy">Office Hours</h4>
                    <p className="text-muted-foreground">
                      {Object.entries(AGENT.hours).map(([key, val]) => (
                        <span key={key} className="block text-sm">
                          <span className="font-medium text-allstate-navy">{key}:</span> {val}
                        </span>
                      ))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-16 bg-allstate-gradient relative overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-64 h-64 bg-allstate-light/10 rounded-full blur-3xl"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Protect What Matters Most?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a personalized insurance quote from Suzanne Dwyer today. Bundle and save up to 25%
            on your premiums!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={AGENT.phoneLink}>
              <Button
                size="lg"
                className="bg-allstate-orange hover:bg-orange-600 text-white font-bold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call {AGENT.phone}
              </Button>
            </a>
            <a href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-allstate-light/50 text-white hover:bg-white/10 font-bold text-lg px-8 py-6 bg-transparent"
              >
                <FileText className="w-5 h-5 mr-2" />
                Request a Quote Online
              </Button>
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-allstate-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Agent Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-allstate-blue flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Suzanne Dwyer</p>
                <p className="text-allstate-light text-sm">Allstate Insurance Agent</p>
              </div>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Elite Agent serving Wynnewood, PA and the surrounding communities in Pennsylvania, New
              Jersey, and Delaware.
            </p>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-allstate-orange" />
              <span className="text-allstate-orange font-semibold text-sm">Elite Agent</span>
            </div>
          </div>

          {/* Insurance Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Insurance</h4>
            <ul className="space-y-2">
              {INSURANCE_TYPES.slice(0, 6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`#insurance-${type.id}`}
                    className="text-white/60 hover:text-allstate-light text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Insurance */}
          <div>
            <h4 className="font-semibold text-white mb-4">More Services</h4>
            <ul className="space-y-2">
              {INSURANCE_TYPES.slice(6).map((type) => (
                <li key={type.id}>
                  <a
                    href={`#insurance-${type.id}`}
                    className="text-white/60 hover:text-allstate-light text-sm transition-colors"
                  >
                    {type.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-allstate-light" />
                <a href={AGENT.phoneLink} className="text-white/60 hover:text-allstate-light text-sm">
                  {AGENT.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-allstate-light" />
                <a href={`mailto:${AGENT.email}`} className="text-white/60 hover:text-allstate-light text-sm break-all">
                  {AGENT.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-allstate-light" />
                <span className="text-white/60 text-sm">{AGENT.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-allstate-light" />
                <span className="text-white/60 text-sm">Mon–Fri: 8:30 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} Suzanne Dwyer – Allstate Insurance Agent. All Rights
              Reserved.
            </p>
            <p className="text-white/30 text-xs mt-1">
              You&apos;re in good hands® — Allstate Insurance Company
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="https://www.allstate.com/" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Allstate.com
            </a>
            <a href="https://www.allstate.com/privacy-center" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Privacy
            </a>
            <a href="https://www.allstate.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-allstate-light transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <InsuranceDetailSections />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
