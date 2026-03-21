import React from 'react';
import { Zap, ArrowRight, Shield, BarChart3, Users, Zap as ZapIcon, Globe, CheckCircle2, HelpCircle, Plus, Minus, Tent, Wrench, Music, Laptop, FileText, Cloud, Package, Lock, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const FAQ_ITEMS = [
  {
    question: "Is SlayteFlow really GST compliant?",
    answer: "Yes, SlayteFlow is built specifically for Indian tax laws. It supports HSN/SAC codes, automatic GST calculations (CGST, SGST, IGST), and generates professional tax invoices that meet all legal requirements."
  },
  {
    question: "Can I export my data?",
    answer: "Absolutely. You can export your invoices as PDFs and your financial data as CSV/Excel files for your CA or for your own records at any time."
  },
  {
    question: "Is my data secure?",
    answer: "We use enterprise-grade encryption and automatic daily backups. Your data is stored securely in the cloud, so you never have to worry about losing your records."
  },
  {
    question: "Do I need a credit card to start?",
    answer: "No. You can start with our Free plan without any credit card. Upgrade only when you need more features."
  }
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d1018] text-[#e2e5f0] selection:bg-[#6c63ff]/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d1018]/80 backdrop-blur-xl border-b border-[#252b3b]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-xl flex items-center justify-center shadow-lg shadow-[#6c63ff]/20">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Slayte<span className="text-[#6c63ff]">Flow</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[#8892ab] hover:text-[#6c63ff] transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-[#8892ab] hover:text-[#6c63ff] transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-[#8892ab] hover:text-[#6c63ff] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onGetStarted}
              className="text-sm font-medium text-[#8892ab] hover:text-[#6c63ff] transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-[#6c63ff]/20"
            >
              Start Free →
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-[#6c63ff]/10 to-transparent blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              The Future of Billing is Here
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
              GST Billing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#9c5cff]">
                Done Right.
              </span>
              <div className="text-2xl md:text-4xl mt-4 text-[#8892ab] font-medium tracking-normal">For ₹99/month.</div>
            </h1>
            <p className="max-w-2xl mx-auto text-[#8892ab] text-lg md:text-xl mb-10 leading-relaxed">
              Professional tax invoices, proforma quotes, cloud sync across all your devices. 
              No CA required, no Tally subscription, no complexity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#6c63ff]/20 group"
              >
                Start Free — No Card Needed
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#features"
                className="w-full sm:w-auto bg-[#1a1f2e] border border-[#252b3b] hover:border-[#6c63ff]/50 text-[#e2e5f0] px-8 py-4 rounded-2xl text-lg font-bold transition-all text-center"
              >
                See Features
              </a>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="bg-[#141824] border border-[#252b3b] rounded-3xl p-4 shadow-2xl overflow-hidden group">
              <img 
                src="https://picsum.photos/seed/billing/1200/800?blur=1" 
                alt="SlayteFlow Dashboard Preview" 
                className="w-full h-auto rounded-2xl opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#0d1018]/80 backdrop-blur-md border border-[#252b3b] p-8 rounded-3xl text-center max-w-sm transform group-hover:scale-105 transition-transform duration-500">
                  <BarChart3 className="w-12 h-12 text-[#6c63ff] mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
                  <p className="text-sm text-[#8892ab]">Track your revenue, GST liabilities, and customer health in one unified view.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trusted By */}
          <div className="mt-32 pt-10 border-t border-[#252b3b]/50">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#4e566b] mb-10">Our Valued Customer</p>
            <div className="flex justify-center items-center gap-12 md:gap-20">
              <div className="flex flex-col items-center gap-2 group">
                <span className="text-2xl font-black tracking-tighter text-[#e2e5f0] transition-colors cursor-default">
                  AK Events
                </span>
                <div className="h-1 w-12 bg-[#6c63ff] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who uses SlayteFlow? */}
      <section className="py-32 px-6 bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              Built for you
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Who uses <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#9c5cff]">SlayteFlow?</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#8892ab] text-lg md:text-xl leading-relaxed">
              If you run a service business in India and need to issue GST invoices — this is for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Tent,
                title: "Event Companies",
                desc: "Tent houses, event managers, decoration services — bill for every event professionally."
              },
              {
                icon: Wrench,
                title: "Contractors",
                desc: "Civil, electrical, plumbing contractors — track jobs, materials, and payments in one place."
              },
              {
                icon: Music,
                title: "Service Providers",
                desc: "Sound, lighting, photography, catering — raise invoices the moment the job is done."
              },
              {
                icon: Laptop,
                title: "Freelancers",
                desc: "Designers, consultants, developers — look professional with GST-compliant invoices."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#141824] border border-[#252b3b] rounded-3xl hover:border-[#6c63ff]/50 transition-all group"
              >
                <div className="w-12 h-12 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#6c63ff] transition-colors">
                  <item.icon className="w-6 h-6 text-[#6c63ff] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-[#8892ab] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-6 border-y border-[#252b3b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Start billing in 3 steps.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#252b3b] to-transparent -translate-y-1/2 -z-10" />
            
            {[
              { step: "01", title: "Create Account", desc: "Sign up with your email. No credit card required to start." },
              { step: "02", title: "Add Details", desc: "Add your company GSTIN and pre-seed your items & customers." },
              { step: "03", title: "Generate Invoice", desc: "Select customer, pick items, and download your PDF invoice." }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-[#141824] border border-[#252b3b] rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:border-[#6c63ff] transition-all relative">
                  <span className="text-xl font-black text-[#6c63ff]">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-[#8892ab] text-sm leading-relaxed max-w-[250px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything you need */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              Features
            </span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Everything you need. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#9c5cff]">Nothing you don't.</span>
            </h2>
            <p className="max-w-2xl mx-auto text-[#8892ab] text-lg md:text-xl leading-relaxed">
              Designed to get out of your way — create an invoice in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tax Invoices Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-8 md:p-12 bg-[#141824] border border-[#252b3b] rounded-[2.5rem] relative overflow-hidden group"
            >
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-8">
                    <FileText className="w-7 h-7 text-[#6c63ff]" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6">Tax Invoices, Quotes & Credit Notes</h3>
                  <p className="text-[#8892ab] text-lg leading-relaxed mb-8">
                    Generate beautiful GST-compliant tax invoices, proforma quotations, and credit notes instantly. 
                    CGST + SGST or IGST auto-calculated. Download as professional B&W PDF, ready to share.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Tax Invoices', 'Proforma', 'Quotations', 'Credit Notes', 'HSN/SAC codes', 'Company Branding'].map(tag => (
                      <span key={tag} className="px-4 py-1.5 rounded-full bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="bg-[#0d1018] border border-[#252b3b] rounded-2xl p-6 shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-sm font-bold">AK Events and Tent House</p>
                        <p className="text-[10px] text-[#4e566b]">GSTIN: 29XXXXX0000X1ZX · Ph: 98XXXXXXXX</p>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#4e566b]">Tax Invoice</p>
                    </div>
                    <div className="border-t border-b border-[#252b3b] py-4 mb-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#4e566b] mb-1">Invoice No.</p>
                        <p className="text-xs font-bold">INV-011</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-widest text-[#4e566b] mb-1">Date</p>
                        <p className="text-xs font-bold">08 Mar 2026</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-[#4e566b] mb-1">Bill To</p>
                        <p className="text-xs font-bold">ABC Builders Pvt Ltd</p>
                        <p className="text-[8px] text-[#4e566b]">GSTIN: 29AABCB1234M1ZP</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-widest text-[#4e566b] mb-1">Due Date</p>
                        <p className="text-xs font-bold">08 Apr 2026</p>
                      </div>
                    </div>
                    <table className="w-full text-[8px] mb-6">
                      <thead className="border-b border-[#252b3b] text-[#4e566b] uppercase tracking-widest">
                        <tr>
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">Qty</th>
                          <th className="text-right py-2">Rate</th>
                          <th className="text-right py-2">GST</th>
                          <th className="text-right py-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#8892ab]">
                        <tr>
                          <td className="py-2 font-bold text-[#e2e5f0]">Sound System</td>
                          <td className="text-right py-2">2</td>
                          <td className="text-right py-2">4,500</td>
                          <td className="text-right py-2">18%</td>
                          <td className="text-right py-2">₹10,620</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-[#e2e5f0]">Stage (Sq.Ft)</td>
                          <td className="text-right py-2">400</td>
                          <td className="text-right py-2">25</td>
                          <td className="text-right py-2">18%</td>
                          <td className="text-right py-2">₹11,800</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-[#e2e5f0]">Decoration</td>
                          <td className="text-right py-2">1</td>
                          <td className="text-right py-2">35,000</td>
                          <td className="text-right py-2">18%</td>
                          <td className="text-right py-2">₹41,300</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-right space-y-1">
                      <p className="text-[8px] text-[#4e566b]">Taxable: ₹49,500 | GST: ₹8,910</p>
                      <p className="text-sm font-bold">Grand Total: ₹58,410</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cloud Sync Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 bg-[#141824] border border-[#252b3b] rounded-[2.5rem] group"
            >
              <div className="w-14 h-14 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-8">
                <Cloud className="w-7 h-7 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Cloud Sync, Any Device</h3>
              <p className="text-[#8892ab] leading-relaxed mb-8">
                Your invoices live in the cloud. Open on your phone, laptop, or office computer — always in sync. 
                No USB drives, no emailing files to yourself.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Real-time sync', 'Any browser'].map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Database Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 bg-[#141824] border border-[#252b3b] rounded-[2.5rem] group"
            >
              <div className="w-14 h-14 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-8">
                <Package className="w-7 h-7 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Item & Customer Database</h3>
              <p className="text-[#8892ab] leading-relaxed mb-8">
                Save your products and services once. When creating an invoice, pick from your catalogue — 
                name, HSN code, rate, and GST% fill automatically.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Item catalogue', 'Customer profiles'].map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Payment Tracking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 bg-[#141824] border border-[#252b3b] rounded-[2.5rem] group"
            >
              <div className="w-14 h-14 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-8">
                <BarChart3 className="w-7 h-7 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Payment Tracking</h3>
              <p className="text-[#8892ab] leading-relaxed mb-8">
                Know exactly who has paid, who is pending, and who is overdue — at a glance. 
                Mark invoices paid, chase overdue amounts, and track your cash flow.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Paid / Pending', 'Overdue alerts'].map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 bg-[#141824] border border-[#252b3b] rounded-[2.5rem] group"
            >
              <div className="w-14 h-14 bg-[#6c63ff]/10 rounded-2xl flex items-center justify-center mb-8">
                <Lock className="w-7 h-7 text-[#6c63ff]" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Your Data, Secure</h3>
              <p className="text-[#8892ab] leading-relaxed mb-8">
                Each account's data is completely isolated. Download a full backup anytime as JSON. 
                No vendor lock-in — your invoices are yours forever.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Row-level security', 'Backup & restore'].map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              User Stories
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Loved by business owners.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "SlayteFlow changed how I bill my clients. I used to spend hours on Excel, now it takes me 2 minutes on my phone.",
                author: "Rahul Sharma",
                role: "Owner, RS Events"
              },
              {
                quote: "The GST calculations are spot on. My CA is happy because all the HSN codes and tax breakdowns are perfect.",
                author: "Priya Patel",
                role: "Freelance Designer"
              },
              {
                quote: "Cloud sync is a lifesaver. I can create an invoice at the site and my office manager can see it instantly.",
                author: "Amit Kumar",
                role: "Director, AK Constructions"
              }
            ].map((t, i) => (
              <div key={i} className="p-8 bg-[#141824] border border-[#252b3b] rounded-3xl relative">
                <div className="text-[#6c63ff] text-5xl font-serif absolute top-4 left-6 opacity-20">“</div>
                <p className="text-[#e2e5f0] text-lg mb-8 relative z-10 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#6c63ff]/20 rounded-full flex items-center justify-center text-[#6c63ff] font-bold">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.author}</p>
                    <p className="text-xs text-[#4e566b]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we compare */}
      <section className="py-32 px-6 bg-[#0a0c12]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6c63ff]/10 text-[#6c63ff] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-[#6c63ff]/20">
              How we compare
            </span>
            <p className="max-w-2xl mx-auto text-[#8892ab] text-lg leading-relaxed">
              BUSY and Tally are powerful full accounting suites — great if you need payroll, balance sheets, and inventory. 
              SlayteFlow is purpose-built for one thing: <span className="text-[#e2e5f0] font-bold">fast, professional GST billing</span> for service businesses.
            </p>
          </div>

          <div className="bg-[#141824] border border-[#252b3b] rounded-[2.5rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#252b3b]">
                  <th className="p-8 text-sm font-bold text-[#4e566b] uppercase tracking-widest">Feature</th>
                  <th className="p-8 text-center bg-[#6c63ff]/5">
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="w-4 h-4 text-[#6c63ff] fill-[#6c63ff]" />
                      <span className="text-sm font-bold text-[#6c63ff]">SlayteFlow</span>
                    </div>
                  </th>
                  <th className="p-8 text-sm font-bold text-[#4e566b] uppercase tracking-widest text-center">Tally</th>
                  <th className="p-8 text-sm font-bold text-[#4e566b] uppercase tracking-widest text-center">BUSY</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { name: "Monthly cost", slayte: "₹99", tally: "₹600+", busy: "₹400+" },
                  { name: "Works on Mobile", slayte: true, tally: false, busy: false },
                  { name: "GST Compliance", slayte: true, tally: true, busy: true },
                  { name: "Cloud Sync", slayte: true, tally: false, busy: false },
                  { name: "Setup Time", slayte: "2 mins", tally: "Days", busy: "Days" },
                  { name: "Ease of Use", slayte: "High", tally: "Low", busy: "Medium" },
                  { name: "Accounting (Full)", slayte: false, tally: true, busy: true },
                  { name: "Inventory Management", slayte: "Basic", tally: "Advanced", busy: "Advanced" },
                  { name: "Payroll", slayte: false, tally: true, busy: true },
                  { name: "Fast Billing", slayte: true, tally: false, busy: false }
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#252b3b] last:border-none hover:bg-[#1a1f2e] transition-colors">
                    <td className="p-8 font-medium text-[#8892ab]">{row.name}</td>
                    <td className="p-8 text-center bg-[#6c63ff]/5 font-bold text-[#6c63ff]">
                      {typeof row.slayte === 'boolean' ? (
                        row.slayte ? <CheckCircle2 className="w-5 h-5 mx-auto" /> : <X className="w-5 h-5 mx-auto opacity-30" />
                      ) : row.slayte}
                    </td>
                    <td className="p-8 text-center text-[#4e566b]">
                      {typeof row.tally === 'boolean' ? (
                        row.tally ? <CheckCircle2 className="w-5 h-5 mx-auto opacity-50" /> : <X className="w-5 h-5 mx-auto opacity-30" />
                      ) : row.tally}
                    </td>
                    <td className="p-8 text-center text-[#4e566b]">
                      {typeof row.busy === 'boolean' ? (
                        row.busy ? <CheckCircle2 className="w-5 h-5 mx-auto opacity-50" /> : <X className="w-5 h-5 mx-auto opacity-30" />
                      ) : row.busy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing.</h2>
            <p className="text-[#8892ab] text-lg">Choose the plan that's right for your business.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-[#141824] border border-[#252b3b] rounded-3xl flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-[#8892ab]">/month</span>
                </div>
                <p className="text-sm text-[#8892ab] mt-4">Perfect for getting started.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Up to 5 invoices/month",
                  "PDF export",
                  "Customer & item database",
                  "Cloud sync (1 device)"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892ab]">
                    <CheckCircle2 className="w-4 h-4 text-[#6c63ff]" />
                    {feature}
                  </li>
                ))}
                {[
                  "Unlimited invoices",
                  "Proforma invoices",
                  "Priority support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#4e566b]">
                    <span className="w-4 text-center">—</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl border border-[#252b3b] hover:border-[#6c63ff] text-white font-bold transition-all"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-[#141824] border-2 border-[#6c63ff] rounded-3xl flex flex-col relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6c63ff] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">₹99</span>
                  <span className="text-[#8892ab]">/month</span>
                </div>
                <p className="text-sm text-[#8892ab] mt-4">For growing businesses.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Unlimited invoices",
                  "PDF export (Tax + Proforma)",
                  "Customer & item database",
                  "Cloud sync — all devices",
                  "Proforma invoices",
                  "Data backup & restore",
                  "Email support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#e2e5f0]">
                    <CheckCircle2 className="w-4 h-4 text-[#6c63ff]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold transition-all shadow-xl shadow-[#6c63ff]/20"
              >
                Start Pro — ₹99/month →
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-[#141824] border border-[#252b3b] rounded-3xl flex flex-col opacity-80">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <p className="text-sm text-[#8892ab] mt-4">For large scale operations.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Everything in Pro",
                  "Multiple team members",
                  "Multiple companies",
                  "WhatsApp invoice sharing",
                  "GST report export",
                  "Priority phone support",
                  "Custom invoice branding"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8892ab]">
                    <CheckCircle2 className="w-4 h-4 text-[#6c63ff]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="w-full py-4 rounded-2xl bg-[#1a1f2e] border border-[#252b3b] text-[#8892ab] font-bold hover:border-[#6c63ff] transition-all"
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 bg-[#0a0c12]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-[#8892ab] text-lg">Everything you need to know about SlayteFlow.</p>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div 
                key={i}
                className="bg-[#141824] border border-[#252b3b] rounded-2xl overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-[#1a1f2e] transition-colors"
                >
                  <span className="font-bold text-[#e2e5f0]">{item.question}</span>
                  {openFaq === i ? <Minus className="w-5 h-5 text-[#6c63ff]" /> : <Plus className="w-5 h-5 text-[#8892ab]" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-[#8892ab] leading-relaxed border-t border-[#252b3b]">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#6c63ff]/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Ready to bill like a pro?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join businesses across India using SlayteFlow. Free to start, takes 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-white text-[#6c63ff] px-10 py-5 rounded-2xl text-xl font-bold hover:bg-[#f5f5f5] transition-all shadow-xl flex items-center justify-center gap-3 group"
              >
                Create Free Account →
              </button>
              <div className="flex flex-col items-center sm:items-start text-white/80 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  No credit card required
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 px-6 bg-[#0a0c12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Get in touch.</h2>
              <p className="text-[#8892ab] text-lg mb-12">
                Have questions or need help setting up? Our team is here to support you.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6c63ff]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#6c63ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#4e566b] font-bold uppercase tracking-widest">Email Support</p>
                    <p className="text-lg font-bold">akilkhan@duck.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#6c63ff]/10 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-[#6c63ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#4e566b] font-bold uppercase tracking-widest">Office</p>
                    <p className="text-lg font-bold">Bangalore, India 🇮🇳</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#141824] border border-[#252b3b] p-8 md:p-12 rounded-[2.5rem]">
              <form 
                className="space-y-6" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name');
                  const email = formData.get('email');
                  const message = formData.get('message');
                  window.location.href = `mailto:akilkhan@duck.com?subject=Query from ${name}&body=From: ${email}%0D%0A%0D%0A${message}`;
                }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4e566b] uppercase tracking-widest ml-1">Name</label>
                  <input name="name" type="text" required className="w-full bg-[#0d1018] border border-[#252b3b] rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4e566b] uppercase tracking-widest ml-1">Email</label>
                  <input name="email" type="email" required className="w-full bg-[#0d1018] border border-[#252b3b] rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#4e566b] uppercase tracking-widest ml-1">Message</label>
                  <textarea name="message" required className="w-full bg-[#0d1018] border border-[#252b3b] rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors min-h-[120px]" placeholder="How can we help?" />
                </div>
                <button type="submit" className="w-full bg-[#6c63ff] hover:bg-[#5a52e0] text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-[#6c63ff]/20">
                  Send Message
                </button>
                <p className="text-[10px] text-[#4e566b] text-center uppercase tracking-widest">
                  Queries are sent directly to akilkhan@duck.com
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#252b3b]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">SlayteFlow</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#features" className="text-sm text-[#8892ab] hover:text-[#6c63ff] transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-[#8892ab] hover:text-[#6c63ff] transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-[#8892ab] hover:text-[#6c63ff] transition-colors">FAQ</a>
              <button 
                onClick={onGetStarted}
                className="text-sm text-[#8892ab] hover:text-[#6c63ff] transition-colors"
              >
                App
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-8 border-t border-[#252b3b]">
            <p className="text-[#4e566b] text-sm">
              © 2026 SlayteFlow · Made in India 🇮🇳
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-[#4e566b] hover:text-[#6c63ff] transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-[#4e566b] hover:text-[#6c63ff] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
