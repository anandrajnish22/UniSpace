import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShoppingBag,
  Briefcase,
  Calendar,
  Users,
  BookOpen,
  Home,
  Sparkles,
  CheckCircle2,
  Star,
  TrendingUp,
  Zap,
  Globe,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';

/* ═══════════════════════════════════════════════════════════
   Animation Variants
   ═══════════════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/* ═══════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════ */

const features = [
  {
    icon: ShoppingBag,
    title: 'UniMarket',
    description: 'Buy & sell books, electronics, furniture and more within your campus community.',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: Briefcase,
    title: 'UniJobs',
    description: 'Discover internships, jobs, and freelance gigs tailored to your skills and goals.',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: Calendar,
    title: 'UniEvents',
    description: 'Find hackathons, workshops, seminars, and campus events — with QR check-in.',
    color: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/20',
  },
  {
    icon: Users,
    title: 'Communities',
    description: 'Join academic and interest-based groups. Discuss, share, and collaborate.',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: BookOpen,
    title: 'UniStudy',
    description: 'Access study resources, notes, previous papers, and create study groups.',
    color: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/20',
  },
  {
    icon: Home,
    title: 'UniRoom',
    description: 'Find roommates, PGs, and flats with smart compatibility matching.',
    color: 'from-primary-500 to-indigo-500',
    shadow: 'shadow-primary-500/20',
  },
];

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and build your digital student identity — skills, projects, achievements, and more.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Discover Opportunities',
    description: 'Browse jobs, events, resources, and marketplace listings personalized for you.',
    icon: TrendingUp,
  },
  {
    number: '03',
    title: 'Connect & Collaborate',
    description: 'Join communities, chat in real time, form study groups, and build your network.',
    icon: Zap,
  },
];

const stats = [
  { value: '50K+', label: 'Students', icon: Users },
  { value: '200+', label: 'Universities', icon: Globe },
  { value: '10K+', label: 'Jobs Posted', icon: Briefcase },
  { value: '5K+', label: 'Events', icon: Calendar },
  { value: '25K+', label: 'Communities', icon: MessageSquare },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Computer Science, IIT Delhi',
    content: 'UniSpace helped me find my dream internship and connect with students who share my passion for AI. The marketplace is a lifesaver during semester transitions!',
    rating: 5,
  },
  {
    name: 'Arjun Patel',
    role: 'MBA, IIM Bangalore',
    content: 'The community feature is incredible. I found study groups for every subject, and the event discovery tool helped me attend hackathons I never knew existed.',
    rating: 5,
  },
  {
    name: 'Sneha Reddy',
    role: 'Design, NID Ahmedabad',
    content: 'Finding a compatible roommate was my biggest worry when moving cities. UniRoom matched me with someone who has a similar lifestyle. Best feature ever!',
    rating: 5,
  },
];

/* ═══════════════════════════════════════════════════════════
   Landing Page Component
   ═══════════════════════════════════════════════════════════ */

export function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'rgba(232,75,58,0.08)' }} />
          <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'rgba(245,166,35,0.05)' }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: 'rgba(232,75,58,0.04)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ fontFamily: "'JetBrains Mono', monospace", background: 'rgba(232,75,58,0.1)', border: '1px solid rgba(232,75,58,0.3)', color: '#e84b3a' }}
              >
                <Sparkles className="w-4 h-4" />
                Study. Work. Connect. Discover.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
              style={{ fontFamily: "'Clash Display', sans-serif", color: '#f5f3ef' }}
            >
              Your University.{' '}
              <span className="text-gradient">One Space.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeUp}
              className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: '#d4d0c8' }}
            >
              Study, discover opportunities, connect with people and build your
              future — all from one platform designed for university students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Get Started — It's Free
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore UniSpace
                </Button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              className="mt-12 flex items-center justify-center gap-6 text-sm text-surface-400"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure & Private</span>
              </div>
              <div className="h-4 w-px bg-surface-200" />
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Free for Students</span>
              </div>
              <div className="h-4 w-px bg-surface-200 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>200+ Universities</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4"
            >
              Everything you need
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold font-display text-surface-900"
            >
              One platform, endless possibilities
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-lg text-surface-500 max-w-2xl mx-auto"
            >
              From finding your next internship to selling your old textbooks — UniSpace
              brings every part of student life together.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group relative bg-surface-50/50 rounded-2xl p-8 border border-surface-200/50 hover:border-surface-200 hover:bg-white hover:shadow-card transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg ${feature.shadow} mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 rounded-full bg-accent-50 text-accent-600 text-sm font-medium mb-4"
            >
              Simple & intuitive
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold font-display text-surface-900"
            >
              Get started in 3 steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeUp}
                className="relative text-center"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-surface-200 to-transparent" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-50 to-accent-50 border border-surface-200/50 mb-6">
                  <step.icon className="w-10 h-10 text-primary-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-surface-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-surface-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATISTICS ──────────────────────────────────── */}
      <section id="stats" className="py-20 lg:py-28 bg-surface-950 text-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-600/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold font-display"
            >
              Trusted by students across India
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-surface-400 text-lg max-w-xl mx-auto"
            >
              Join a growing community of students building their futures.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-5 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold font-display text-gradient">
                  {stat.value}
                </p>
                <p className="text-surface-400 text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium mb-4"
            >
              Student stories
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold font-display text-surface-900"
            >
              Loved by students everywhere
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-surface-50/50 rounded-2xl p-8 border border-surface-200/50"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-surface-600 text-sm leading-relaxed mb-6">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-semibold">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-surface-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="relative rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800 p-12 md:p-16 lg:p-20 text-center overflow-hidden"
          >
            {/* Decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-accent-500/10 blur-2xl" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
                Ready to transform your{' '}
                <br className="hidden sm:block" />
                university experience?
              </h2>
              <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
                Join thousands of students already using UniSpace to study, connect,
                and discover opportunities.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white text-primary-700 hover:bg-primary-50 shadow-lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white/90 hover:text-white hover:bg-white/10"
                  >
                    Already have an account?
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
