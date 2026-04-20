'use client'

import { useState, useTransition } from 'react'
import { Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { sendMessage } from '@/actions/message'
import { motion, Variants } from 'motion/react'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

/* ── Inline SVG brand icons ─────────────────────────────────── */
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12.5 3 11c-1.2.6-2.5.5-3.5-.5 1-1.3 2.8-1.5 4-1.5-1-1.5-3.5-.5-5 1.5 2 3.5 3.5 6 4-.5-3.5 4-5.5 6.5-3 1.5-.5 3-1.5 4-2.5-1 1.5-2.5 3-4 3.5z"></path>
  </svg>
)

/* ── Types ──────────────────────────────────────────────────── */
type FormState = 'idle' | 'loading' | 'success' | 'error'

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  budget: '',
  message: '',
}

/* ── Component ───────────────────────────────────────────────── */
const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const isLoading = formState === 'loading' || isPending

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('loading')
    setErrorMsg('')

    startTransition(async () => {
      const result = await sendMessage(form)
      if ('error' in result && result.error) {
        setErrorMsg(result.error)
        setFormState('error')
      } else {
        setFormState('success')
        setForm(INITIAL_FORM)
      }
    })
  }

  return (
    <>

       <motion.header
       initial="hidden"
        animate="visible"
        variants={staggerContainer}
       className="bg-brand-offwhite pt-24 pb-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <span className="text-brand-orange font-semibold flex items-center justify-center gap-2 text-sm mb-6">
                <span className="w-4 h-[2px] bg-brand-orange"></span> Get In Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-brand-dark mb-6">
                Let's build something <br/> <span className="text-brand-orange italic font-normal">phenomenal.</span>
            </h1>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed">
                Whether you need a massive architectural overhaul, a high-performance native app, or just want to discuss the finer points of Kotlin coroutines, my inbox is open.
            </p>
        </div>
    </motion.header>

      {/* ── CONTACT DETAILS + FORM ───────────────────────────────── */}
      <motion.section 
        className="py-16 sm:py-24 bg-brand-light"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

            {/* LEFT — Contact Details */}
            <motion.div variants={fadeInUp} className="lg:col-span-5 reveal">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-brand-dark mb-6 sm:mb-8">
                Contact Details
              </h1>

              {/* Availability badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#f0f4f1] border border-brand-green/20 rounded-full mb-8 sm:mb-10">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold text-brand-green">Currently accepting new projects</span>
              </div>

              {/* Info rows */}
              <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12">
                {/* Email */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-offwhite border border-gray-200 rounded-sharp flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Email Address</span>
                    <a
                      href="mailto:hello@Nikola.dev"
                      className="text-base sm:text-lg font-semibold text-brand-dark hover:text-brand-orange transition-colors break-all"
                    >
                      hello@Nikola.dev
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-offwhite border border-gray-200 rounded-sharp flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Location</span>
                    <span className="text-base sm:text-lg font-semibold text-brand-dark">Lagos, Nigeria (WAT)</span>
                    <span className="block text-sm text-brand-muted mt-1">Available for remote collaboration worldwide.</span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-offwhite border border-gray-200 rounded-sharp flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-1">Working Hours</span>
                    <span className="text-base sm:text-lg font-semibold text-brand-dark">9:00 AM – 6:00 PM</span>
                    <span className="block text-sm text-brand-muted mt-1">Monday through Friday</span>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-6 sm:pt-8 border-t border-gray-200">
                <span className="block text-xs font-bold text-brand-muted uppercase tracking-widest mb-4">Social Profiles</span>
                <div className="flex gap-3 flex-wrap">
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all shadow-md"
                  >
                    <LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a
                    href="#"
                    aria-label="GitHub"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all shadow-md"
                  >
                    <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all shadow-md"
                  >
                    <TwitterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Form card */}
            <motion.div variants={fadeInUp} className="lg:col-span-7 reveal delay-100">
              <div className="bg-white p-6 sm:p-8 md:p-12 border border-gray-200 rounded-sharp shadow-xl shadow-gray-100/50 relative overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Success state */}
                {formState === 'success' ? (
                  <div className="flex flex-col items-center text-center py-8 sm:py-12 relative z-10">
                    <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-brand-green mb-5" strokeWidth={1.5} />
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-brand-dark mb-3">
                      Message sent!
                    </h2>
                    <p className="text-brand-muted text-sm sm:text-base max-w-sm mb-8">
                      I read every message personally and will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="text-sm font-semibold text-brand-orange hover:text-brand-dark transition-colors underline underline-offset-4"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-extrabold tracking-tighter text-brand-dark mb-6 sm:mb-8 relative z-10">
                      Send a Message
                    </h2>

                    {/* Error banner */}
                    {formState === 'error' && (
                      <div className="flex items-start gap-3 mb-5 p-4 rounded-sharp bg-red-50 border border-red-200 text-red-700 text-sm relative z-10">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{errorMsg || 'Something went wrong. Please try again.'}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 relative z-10">
                      {/* Name + Email — stacked on mobile, side-by-side on md+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label htmlFor="name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="form-input"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            className="form-input"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Service */}
                      <div>
                        <label htmlFor="subject" className="form-label">Subject / Service Needed</label>
                        <select
                          id="subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          className="form-input appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1em_1em] cursor-pointer"
                          style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231a1a1a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')" }}
                          disabled={isLoading}
                        >
                          <option value="">Select an option</option>
                          <option value="Native Mobile App Development">Native Mobile App Development</option>
                          <option value="Web Architecture / Dashboard">Web Architecture / Dashboard</option>
                          <option value="Technical Consulting">Technical Consulting</option>
                          <option value="Other Inquiry">Other Inquiry</option>
                        </select>
                      </div>

                      {/* Budget */}
                      <div>
                        <label htmlFor="budget" className="form-label">Estimated Budget <span className="normal-case font-normal text-brand-muted">(optional)</span></label>
                        <input
                          type="text"
                          id="budget"
                          name="budget"
                          value={form.budget}
                          onChange={handleChange}
                          placeholder="e.g., $10k – $20k"
                          className="form-input"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="form-label">Project Details</label>
                        <textarea
                          id="message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Tell me about your timeline, goals, and the problem you are trying to solve..."
                          className="form-input resize-none"
                          required
                          disabled={isLoading}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        id="contact-submit"
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto min-w-[10rem] px-8 sm:px-10 py-4 bg-brand-green text-white font-bold rounded-full hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-3 group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <motion.section 
        className="py-16 sm:py-24 bg-brand-offwhite border-t border-gray-200"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 reveal">
          <motion.div variants={fadeInUp} className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-brand-dark mb-3 sm:mb-4">Client FAQ</h2>
            <p className="text-brand-muted text-base sm:text-lg">Common questions regarding my workflow and availability.</p>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div variants={fadeInUp} className="bg-white border border-gray-200 p-5 sm:p-8 rounded-sharp shadow-sm">
              <h4 className="text-base sm:text-lg font-bold text-brand-dark mb-2 sm:mb-3">What is your typical project timeline?</h4>
              <p className="text-brand-muted leading-relaxed text-sm sm:text-base">Depending on the scope, an enterprise mobile application architecture can take anywhere from 3 to 6 months. I prioritize clean, scalable code over rushed MVPs, ensuring your foundation is built for millions of users.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white border border-gray-200 p-5 sm:p-8 rounded-sharp shadow-sm">
              <h4 className="text-base sm:text-lg font-bold text-brand-dark mb-2 sm:mb-3">Do you work with startups for equity?</h4>
              <p className="text-brand-muted leading-relaxed text-sm sm:text-base">I generally operate on a milestone-based flat fee or a retained consulting rate. However, I am open to hybrid compensation (cash + equity) for highly compelling products with strong founding teams.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="bg-white border border-gray-200 p-5 sm:p-8 rounded-sharp shadow-sm">
              <h4 className="text-base sm:text-lg font-bold text-brand-dark mb-2 sm:mb-3">Do you handle UI/UX design as well?</h4>
              <p className="text-brand-muted leading-relaxed text-sm sm:text-base">While my primary expertise is software architecture and engineering (Kotlin/Java/React), I have deep experience implementing complex design systems and can bridge the gap flawlessly between your design team and the codebase.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  )
}

export default Contact