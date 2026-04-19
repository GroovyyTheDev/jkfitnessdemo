import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Dumbbell, Menu, X, Star, Play, ArrowRight, Check,
  Flame, Apple, UserRound, Target, Heart, Activity,
  Clock, Phone, Mail, MapPin, Instagram, Facebook, Youtube
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/* ---------- Data ---------- */
const NAV = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Packages", id: "packages" },
  { label: "Reviews", id: "reviews" },
  { label: "Contact", id: "contact" },
];

const SERVICES = [
  { icon: Flame, title: "Weight Management", desc: "Burn fat and build your ideal physique with structured, science-backed plans.", span: "md:col-span-5" },
  { icon: Apple, title: "Nutrition Consultation", desc: "Personalized diet plans built around your goals, body type and lifestyle.", span: "md:col-span-7" },
  { icon: UserRound, title: "Personal Trainers", desc: "Train with experienced pros who push your limits every single session.", span: "md:col-span-7" },
  { icon: Target, title: "Get Your Own Trainer", desc: "One-on-one coaching for faster, focused, uncompromising results.", span: "md:col-span-5" },
];

const OPTIONS = [
  { title: "Gym Training", tag: "Strength & Muscle", desc: "Compound lifts, hypertrophy blocks, progressive overload.", img: "https://images.pexels.com/photos/14289784/pexels-photo-14289784.jpeg", icon: Dumbbell },
  { title: "CrossFit", tag: "High Intensity", desc: "Functional workouts that burn fat and build real-world strength.", img: "https://images.unsplash.com/photo-1467818488384-3a21f2b79959?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2ZpdCUyMGd5bSUyMHdvcmtvdXR8ZW58MHx8fHwxNzc2NTc0NTkwfDA&ixlib=rb-4.1.0&q=85", icon: Activity },
  { title: "Aerobics", tag: "Stamina & Fat Loss", desc: "Fun, upbeat sessions designed to torch calories and boost energy.", img: "https://images.unsplash.com/photo-1662045010187-80bf72e85eee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxjcm9zc2ZpdCUyMGd5bSUyMHdvcmtvdXR8ZW58MHx8fHwxNzc2NTc0NTkwfDA&ixlib=rb-4.1.0&q=85", icon: Heart },
];

const PACKAGES = [
  { group: "Gents", icon: "Gents", featured: false, items: [
    { label: "1 Month", price: 1500 },
    { label: "3 Months", price: 3000 },
    { label: "6 Months", price: 5000 },
    { label: "1 Year", price: 8000, tag: "Best Value" },
  ]},
  { group: "Ladies", icon: "Ladies", featured: true, items: [
    { label: "1 Month", price: 1200 },
    { label: "3 Months", price: 2500 },
    { label: "6 Months", price: 4500 },
    { label: "1 Year", price: 8000, tag: "Best Value" },
  ]},
  { group: "Personal Training", icon: "PT", featured: false, items: [
    { label: "1 Month", price: 7000 },
    { label: "3 Months", price: 19000, tag: "Pro" },
  ]},
  { group: "Trial", icon: "Trial", featured: false, items: [
    { label: "Per Day", price: 100, tag: "Try it out" },
  ]},
];

const REVIEWS = [
  { name: "Abhay Patel", text: "Good gym, also gym owner and trainer are very friendly.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwyfHxwb3J0cmFpdCUyMGZhY2V8ZW58MHx8fHwxNzc2NTc0NTk5fDA&ixlib=rb-4.1.0&q=85" },
  { name: "Vishnukumar P Gajiwala", text: "Good place for Dindoli public, great for a healthy and fit life.", avatar: "https://images.pexels.com/photos/17473635/pexels-photo-17473635.jpeg" },
  { name: "Anand Dwivedi", text: "Very nice gym at a very affordable price.", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGZhY2V8ZW58MHx8fHwxNzc2NTc0NTk5fDA&ixlib=rb-4.1.0&q=85" },
  { name: "Jaydev Paver", text: "Perfect gym for all age groups — men and women. You'll love it.", avatar: "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwzfHxwb3J0cmFpdCUyMGZhY2V8ZW58MHx8fHwxNzc2NTc0NTk5fDA&ixlib=rb-4.1.0&q=85" },
  { name: "Nilesh Shinde", text: "Outstanding coach and staff.", avatar: "https://images.pexels.com/photos/32806347/pexels-photo-32806347.jpeg" },
];

const HERO_IMG = "https://images.unsplash.com/photo-1754475118668-64ac3f3b2559?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxtdXNjdWxhciUyMG1hbiUyMHJlZCUyMGhvb2RpZXxlbnwwfHx8fDE3NzY1NzQ1OTB8MA&ixlib=rb-4.1.0&q=85";

const CONTACT = {
  email: "xyz@gmail.com",
  phone: "+91 07942684277",
  address: "Shop No. 10 F, Sai Darshan Residency, Opposite Uma Plaza, Dindoli Kharwasa Road, Dindoli, Surat-394210, Gujarat",
};

/* ---------- Helpers ---------- */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Get Started Dialog ---------- */
function GetStartedDialog({ open, onOpenChange, source = "hero" }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in name, email and phone.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, { ...form, source });
      toast.success("You're in. Our team will reach out shortly.");
      setForm({ name: "", email: "", phone: "", goal: "" });
      onOpenChange(false);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Could not submit. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="get-started-dialog"
        className="sm:max-w-[640px] bg-[#0A0A0A] border-white/10 text-white p-0 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left: contact panel */}
          <div className="md:col-span-2 relative p-8 bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F]">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <p className="font-anton text-2xl uppercase leading-none">JK Fitness</p>
              <p className="text-xs uppercase tracking-[0.25em] mt-2 text-white/80">Get Started</p>
              <p className="font-anton text-4xl uppercase mt-8 leading-[0.95]">Transform. <br/>Today.</p>
              <div className="mt-10 space-y-5 text-sm">
                <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0" /><span>{CONTACT.phone}</span></div>
                <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><span className="break-all">{CONTACT.email}</span></div>
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span className="leading-snug">{CONTACT.address}</span></div>
              </div>
            </div>
          </div>
          {/* Right: form */}
          <form onSubmit={submit} className="md:col-span-3 p-8 space-y-4">
            <DialogHeader>
              <DialogTitle className="font-anton text-3xl uppercase">Join the movement</DialogTitle>
              <DialogDescription className="text-zinc-400">Drop your details and a coach will call you back.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <Input data-testid="lead-name-input" placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-xl" />
              <Input data-testid="lead-email-input" type="email" placeholder="Email address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-xl" />
              <Input data-testid="lead-phone-input" placeholder="Phone number" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-zinc-500 h-12 rounded-xl" />
              <Textarea data-testid="lead-goal-input" placeholder="Your goal (optional)" value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-zinc-500 min-h-[88px] rounded-xl" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              data-testid="lead-submit-button"
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] hover:opacity-95 text-white font-bold uppercase tracking-wide glow-red"
            >
              {loading ? "Sending..." : (<span className="flex items-center justify-center gap-2">Claim My Free Consult <ArrowRight className="h-4 w-4" /></span>)}
            </Button>
            <p className="text-[11px] text-zinc-500">By submitting, you agree to be contacted by JK Fitness.</p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Navbar ---------- */
function Navbar({ onSignup }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#home" data-testid="nav-logo" className="flex items-center gap-2 group" onClick={(e)=>{e.preventDefault();scrollToId("home");}}>
          <span className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F] grid place-items-center glow-red">
            <Dumbbell className="h-5 w-5 text-white" />
          </span>
          <span className="font-anton text-xl tracking-wide uppercase">JK <span className="text-[#FF2D2D]">Fitness</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {NAV.map((n) => (
            <button
              key={n.id}
              data-testid={`nav-link-${n.id}`}
              onClick={() => scrollToId(n.id)}
              className="text-sm uppercase tracking-[0.18em] text-zinc-300 hover:text-white transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            onClick={onSignup}
            data-testid="nav-signup-button"
            className="hidden sm:inline-flex rounded-full h-11 px-6 bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] hover:opacity-95 text-white font-bold uppercase tracking-wide text-xs"
          >
            Sign Up
          </Button>
          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden h-11 w-11 grid place-items-center rounded-full border border-white/10 bg-white/[0.04]"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`mobile-nav-${n.id}`}
                onClick={() => { scrollToId(n.id); setMobileOpen(false); }}
                className="text-left text-sm uppercase tracking-[0.18em] text-zinc-300 hover:text-white"
              >
                {n.label}
              </button>
            ))}
            <Button
              onClick={() => { onSignup(); setMobileOpen(false); }}
              data-testid="mobile-signup-button"
              className="rounded-full h-11 bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] text-white font-bold uppercase text-xs"
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero({ onGetStarted }) {
  return (
    <section id="home" data-testid="hero-section" className="relative min-h-screen overflow-hidden pt-20">
      {/* Right side image */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[58%]">
        <img src={HERO_IMG} alt="Muscular athlete in red hoodie" className="h-full w-full object-cover object-center" />
        {/* gradient mask: black on left fading to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 md:via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* Ambient red blur */}
      <div aria-hidden className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#FF2D2D]/25 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 min-h-[calc(100vh-5rem)] grid md:grid-cols-12 items-center gap-12">
        <div className="md:col-span-7 lg:col-span-6 pt-10 md:pt-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF2D2D] animate-pulseGlow" />
            <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-300">Dindoli · Surat</span>
          </div>

          <h1 className="font-anton mt-6 text-5xl sm:text-6xl lg:text-[88px] uppercase leading-[0.88] tracking-tight">
            <span className="text-[#FF2D2D] text-glow-red">Stronger</span><br/>
            Every Day<br/>
            Starts Here
          </h1>

          <p className="mt-4 font-anton text-lg sm:text-xl uppercase tracking-widest text-zinc-300">
            Train Hard. Transform Fully. <span className="text-[#FF2D2D]">Become Unstoppable.</span>
          </p>

          <p className="mt-6 max-w-xl text-zinc-400 text-base sm:text-lg leading-relaxed">
            At JK Fitness, we help you build strength, confidence and discipline — physically and mentally.
            Whether you're starting out or pushing your limits, our expert trainers and personalized programs
            guide you every step of the way.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              onClick={onGetStarted}
              data-testid="hero-get-started-button"
              className="h-14 px-8 rounded-full bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] hover:opacity-95 text-white font-bold uppercase tracking-wide glow-red"
            >
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              onClick={() => scrollToId("packages")}
              data-testid="hero-view-packages-button"
              variant="outline"
              className="h-14 px-8 rounded-full bg-white/[0.04] border-white/15 text-white hover:bg-white/[0.08] font-bold uppercase tracking-wide"
            >
              View Packages
            </Button>
          </div>

          {/* stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { k: "100+", v: "Happy members" },
              { k: "12+", v: "Expert coaches" },
              { k: "5★", v: "Average rating" },
            ].map((s, i) => (
              <div key={i} data-testid={`hero-stat-${i}`} className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 backdrop-blur-md">
                <p className="font-anton text-3xl leading-none">{s.k}</p>
                <p className="text-[11px] uppercase tracking-widest text-zinc-400 mt-2">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const items = ["Strength", "Discipline", "Nutrition", "CrossFit", "Transformation", "Cardio", "Aerobics", "Power", "Mindset"];
  const row = [...items, ...items];
  return (
    <div className="relative border-y border-white/10 bg-[#080808] overflow-hidden">
      <div className="flex gap-16 py-6 whitespace-nowrap animate-marquee">
        {row.map((w, i) => (
          <span key={i} className="font-anton uppercase text-3xl sm:text-4xl tracking-tight text-white/80">
            {w} <span className="text-[#FF2D2D] mx-6">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <section id="about" data-testid="about-section" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
            <img src="https://images.pexels.com/photos/9958668/pexels-photo-9958668.jpeg" alt="Gym atmosphere" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <p className="font-anton text-4xl uppercase">Since Day One</p>
                <p className="text-sm text-zinc-300">Built for real people · real results</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F] grid place-items-center glow-red">
                <Dumbbell className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F] items-center justify-center glow-red animate-floatY">
            <span className="font-anton text-2xl uppercase leading-none text-center">5★<br/><span className="text-[10px] tracking-widest">rated</span></span>
          </div>
        </div>
        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF2D2D] font-bold">About JK Fitness</p>
          <h2 className="font-anton mt-3 text-4xl sm:text-5xl uppercase leading-[0.95]">
            Unisex Fitness.<br/>
            <span className="text-[#FF2D2D]">Real Results.</span>
          </h2>
          <p className="mt-6 text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl">
            JK Fitness is built for everyone — men and women committed to becoming their best version.
            From fat loss to muscle gain, we combine expert training, proper nutrition and consistency
            to deliver real, lasting transformation.
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl">
            {[
              "Personalized programs",
              "Nutrition coaching",
              "Modern equipment",
              "Certified trainers",
            ].map((t, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-zinc-200">
                <span className="h-6 w-6 rounded-full bg-[#FF2D2D]/15 border border-[#FF2D2D]/40 grid place-items-center">
                  <Check className="h-3.5 w-3.5 text-[#FF2D2D]" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
function Services() {
  return (
    <section id="services" data-testid="services-section" className="relative py-24 sm:py-32 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF2D2D] font-bold">What we offer</p>
            <h2 className="font-anton mt-3 text-4xl sm:text-5xl uppercase leading-[0.95]">
              Everything You Need<br/>
              to <span className="text-[#FF2D2D]">Transform</span>
            </h2>
          </div>
          <p className="text-zinc-400 max-w-md">Custom programs, expert coaching and the accountability you need to hit goals — not just set them.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-12 gap-6">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              data-testid={`service-card-${i}`}
              className={`${s.span} group relative p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#FF2D2D]/50 transition-colors overflow-hidden`}
            >
              <div aria-hidden className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#FF2D2D]/0 group-hover:bg-[#FF2D2D]/15 blur-3xl transition-all duration-500" />
              <s.icon className="h-8 w-8 text-[#FF2D2D]" />
              <h3 className="font-anton mt-6 text-2xl sm:text-3xl uppercase">{s.title}</h3>
              <p className="mt-3 text-zinc-400 max-w-md">{s.desc}</p>
              <div className="mt-8 h-px w-full bg-white/10" />
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-zinc-300 group-hover:text-white transition-colors">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Fitness options */}
        <div className="mt-24">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h3 className="font-anton text-3xl sm:text-4xl uppercase">Train Your <span className="text-[#FF2D2D]">Way</span></h3>
            <p className="text-zinc-400 text-sm max-w-sm">Choose a style that fits your goal — or mix them all.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {OPTIONS.map((o, i) => (
              <div
                key={i}
                data-testid={`option-card-${i}`}
                className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] group"
              >
                <img src={o.img} alt={o.title} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em]">
                  {o.tag}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F] grid place-items-center">
                      <o.icon className="h-5 w-5" />
                    </span>
                    <h4 className="font-anton text-2xl uppercase">{o.title}</h4>
                  </div>
                  <p className="mt-3 text-sm text-zinc-300">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Packages ---------- */
function Packages({ onJoin }) {
  return (
    <section id="packages" data-testid="packages-section" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF2D2D] font-bold">Pricing</p>
          <h2 className="font-anton mt-3 text-4xl sm:text-5xl uppercase leading-[0.95]">
            Flexible Plans<br/>for <span className="text-[#FF2D2D]">Everyone</span>
          </h2>
          <p className="mt-5 text-zinc-400">Straightforward pricing. No hidden fees. Pick a plan and start today.</p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((p, i) => (
            <div
              key={i}
              data-testid={`package-card-${i}`}
              className={`relative p-8 rounded-3xl border ${p.featured ? "border-[#FF2D2D]/60 bg-[#160a0a]" : "border-white/10 bg-white/[0.02]"} overflow-hidden flex flex-col`}
            >
              {p.featured && (
                <span className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.25em] bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] px-3 py-1 rounded-full">Popular</span>
              )}
              {p.featured && <div aria-hidden className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[#FF2D2D]/30 blur-3xl" />}
              <h3 className="font-anton text-3xl uppercase">{p.group}</h3>
              <p className="mt-1 text-zinc-400 text-sm">Choose the term that fits you</p>

              <ul className="mt-8 space-y-4 flex-1">
                {p.items.map((it, j) => (
                  <li key={j} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{it.label}</p>
                      {it.tag && <p className="text-[10px] uppercase tracking-[0.2em] text-[#FF2D2D]">{it.tag}</p>}
                    </div>
                    <p className="font-anton text-2xl">₹{it.price.toLocaleString()}</p>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onJoin}
                data-testid={`package-join-${i}`}
                className={`mt-8 h-12 rounded-full font-bold uppercase tracking-wide ${
                  p.featured
                    ? "bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] hover:opacity-95 glow-red"
                    : "bg-white/[0.05] border border-white/15 hover:bg-white/[0.1]"
                }`}
              >
                Join Now
              </Button>
            </div>
          ))}
        </div>

        {/* Timings */}
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {[
            { title: "Morning", time: "5:00 AM – 11:00 AM", icon: Clock },
            { title: "Evening", time: "3:50 PM – 10:00 PM", icon: Clock },
          ].map((t, i) => (
            <div key={i} data-testid={`timing-${i}`} className="flex items-center justify-between gap-6 p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-2xl bg-[#FF2D2D]/15 border border-[#FF2D2D]/30 grid place-items-center">
                  <t.icon className="h-5 w-5 text-[#FF2D2D]" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">Timings</p>
                  <p className="font-anton text-2xl uppercase leading-tight">{t.title}</p>
                </div>
              </div>
              <p className="font-anton text-xl sm:text-2xl">{t.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
function Reviews() {
  return (
    <section id="reviews" data-testid="reviews-section" className="relative py-24 sm:py-32 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF2D2D] font-bold">Testimonials</p>
            <h2 className="font-anton mt-3 text-4xl sm:text-5xl uppercase leading-[0.95]">
              Real People.<br/>Real <span className="text-[#FF2D2D]">Results.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#FF2D2D] text-[#FF2D2D]" />
            ))}
            <span className="ml-2 text-sm text-zinc-300">Loved by <b>100+</b> members</span>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              data-testid={`review-card-${i}`}
              className={`relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] ${i === 1 ? "lg:row-span-2 lg:-translate-y-6" : ""}`}
            >
              <div className="flex items-center gap-3">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-[#FF2D2D] text-[#FF2D2D]" />
                ))}
              </div>
              <p className="mt-5 text-zinc-200 text-lg leading-snug">"{r.text}"</p>
              <div className="mt-8 flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                <div>
                  <p className="font-anton uppercase text-base leading-tight">{r.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Verified member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA({ onJoin }) {
  return (
    <section id="contact" data-testid="final-cta-section" className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF2D2D]/25 via-transparent to-transparent blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0A0A0A] p-10 md:p-16">
          <div aria-hidden className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-[#FF2D2D]/40 blur-[140px]" />
          <div className="relative grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-3">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF2D2D] font-bold">Your move</p>
              <h2 className="font-anton mt-3 text-5xl sm:text-6xl uppercase leading-[0.92]">
                Your Fitness<br/>Journey<br/>
                <span className="text-[#FF2D2D]">Starts Today</span>
              </h2>
              <p className="mt-5 text-zinc-300 max-w-xl">Don't wait. Don't quit. Transform. Join JK Fitness now and train alongside people who push you to be better.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  onClick={onJoin}
                  data-testid="final-cta-join-button"
                  className="h-14 px-8 rounded-full bg-gradient-to-r from-[#FF2D2D] to-[#FF3B1F] hover:opacity-95 text-white font-bold uppercase tracking-wide glow-red"
                >
                  Join JK Fitness Now <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                  data-testid="final-cta-call-button"
                  className="h-14 px-8 rounded-full bg-white/[0.05] border border-white/15 inline-flex items-center gap-2 hover:bg-white/[0.1] font-bold uppercase tracking-wide text-sm"
                >
                  <Phone className="h-4 w-4" /> Call Us
                </a>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              {[
                { icon: Phone, label: "Phone", value: CONTACT.phone },
                { icon: Mail, label: "Email", value: CONTACT.email },
                { icon: MapPin, label: "Address", value: CONTACT.address },
              ].map((c, i) => (
                <div key={i} data-testid={`contact-${c.label.toLowerCase()}`} className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="h-11 w-11 rounded-xl bg-[#FF2D2D]/15 border border-[#FF2D2D]/30 grid place-items-center shrink-0">
                    <c.icon className="h-5 w-5 text-[#FF2D2D]" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">{c.label}</p>
                    <p className="text-sm text-white mt-1 leading-snug">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer data-testid="footer" className="relative border-t border-white/10 bg-[#030303]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FF2D2D] to-[#FF3B1F] grid place-items-center"><Dumbbell className="h-5 w-5" /></span>
            <span className="font-anton text-xl uppercase">JK <span className="text-[#FF2D2D]">Fitness</span></span>
          </div>
          <p className="mt-4 text-zinc-400 max-w-sm">Train Hard. Transform Fully. Become Unstoppable. Dindoli's favourite unisex fitness studio.</p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" data-testid={`social-${i}`} className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/10 grid place-items-center hover:border-[#FF2D2D]/60 transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-anton uppercase text-lg">Explore</p>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            {NAV.map(n => (
              <li key={n.id}><button onClick={() => scrollToId(n.id)} className="hover:text-white">{n.label}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-anton uppercase text-lg">Visit</p>
          <ul className="mt-4 space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5" /><span>{CONTACT.phone}</span></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5" /><span>{CONTACT.email}</span></li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /><span>{CONTACT.address}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} JK Fitness. All rights reserved.
      </div>
    </footer>
  );
}

/* ---------- Main ---------- */
export default function Landing() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSource, setDialogSource] = useState("hero");

  const openDialog = (source = "hero") => {
    setDialogSource(source);
    setDialogOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white grain overflow-x-hidden">
      <Navbar onSignup={() => openDialog("navbar")} />
      <main className="relative z-10">
        <Hero onGetStarted={() => openDialog("hero")} />
        <Marquee />
        <About />
        <Services />
        <Packages onJoin={() => openDialog("packages")} />
        <Reviews />
        <FinalCTA onJoin={() => openDialog("final-cta")} />
      </main>
      <Footer />
      <GetStartedDialog open={dialogOpen} onOpenChange={setDialogOpen} source={dialogSource} />
    </div>
  );
}
