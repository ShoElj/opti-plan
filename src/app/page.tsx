import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Calendar as CalendarIcon, 
  Bell, 
  HeartPulse, 
  PieChart, 
  Activity, 
  ArrowRight,
  Wallet,
  Shield
} from 'lucide-react';
import { FAQSection } from '@/components/layout/FAQSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-emerald-500/30">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              OP
            </div>
            <span className="font-extrabold tracking-tight text-lg">Opti-Plan</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-emerald-600 transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild className="rounded-xl shadow-sm shadow-emerald-500/20">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Opti-Plan is now available
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Your money, <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">made clearer.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent personal finance tracker and budgeting app. Stop wondering where your money went. Track your spending and savings, manage your bills, and spend with total clarity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-xl text-base h-12 shadow-md shadow-emerald-600/20">
              <Link href="/signup">Create Free Account <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <div className="w-full sm:w-auto h-12 flex items-center justify-center">
              <div className="w-full max-w-[240px]">
                {/* Re-use the existing component for Google login in a visually compatible way, or just link to signup */}
                <Button variant="outline" asChild size="lg" className="w-full rounded-xl text-base h-12">
                   <Link href="/login">Log In to Account</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Trust Signal */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-muted-foreground font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Bank-level encryption &middot; We never move your money</span>
          </div>
          
          {/* HERO DASHBOARD PREVIEW */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent blur-3xl -z-10 rounded-full opacity-50 dark:opacity-20" />
            <div className="glass-card rounded-2xl border shadow-2xl overflow-hidden p-2 sm:p-4 bg-background/50">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
                {/* Mock Header */}
                <div className="h-14 border-b border-border/40 flex items-center px-4 justify-between bg-muted/20" aria-hidden="true">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="h-6 w-32 bg-muted rounded-md opacity-50"></div>
                </div>
                {/* Mock Content */}
                <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Money Left this month</p>
                      <h3 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">$2,450.00</h3>
                    </div>
                    <div className="space-y-4">
                      {/* Mock Chart Area */}
                      <div className="h-32 rounded-xl border bg-muted/20 flex items-end justify-between p-4 px-6 gap-2" aria-hidden="true">
                        {[40, 25, 60, 30, 80, 45, 100].map((height, i) => (
                          <div key={i} className="w-full bg-emerald-500/20 dark:bg-emerald-500/30 rounded-t-sm hover:bg-emerald-500/40 transition-colors relative group" style={{ height: `${height}%` }}>
                            {i === 6 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Today</div>}
                          </div>
                        ))}
                      </div>
                      
                      {/* Mock Transactions */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Activity</p>
                        {[
                          { name: 'Whole Foods Market', category: 'Groceries', amount: '-$84.20' },
                          { name: 'Netflix Subscription', category: 'Bills', amount: '-$15.49' },
                          { name: 'Salary Transfer', category: 'Income', amount: '+$3,200.00', positive: true },
                        ].map((tx, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-card text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px]">
                                {tx.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{tx.name}</div>
                                <div className="text-[11px] text-muted-foreground">{tx.category}</div>
                              </div>
                            </div>
                            <div className={`font-bold ${tx.positive ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                              {tx.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border bg-muted/10">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Financial Health</p>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                        <HeartPulse className="w-4 h-4" /> Healthy
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/10">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Upcoming Bill</p>
                      <div className="text-sm font-bold">Internet - $60.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="w-full bg-muted/30 py-24 border-y border-border/40">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Money is scattered. Opti-Plan brings it together.</h2>
            <p className="text-muted-foreground text-lg mb-12">
              Between expenses, bills, savings goals, and debt, it&apos;s hard to know exactly what you actually have left to spend. Opti-Plan calculates your true &quot;Money Left&quot; so you can spend with confidence.
            </p>
            
            {/* Formula Visualization */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-16 text-sm sm:text-base font-bold">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Income</div>
              <div className="text-muted-foreground">&minus;</div>
              <div className="px-3 py-1.5 rounded-lg bg-muted">Bills</div>
              <div className="text-muted-foreground">&minus;</div>
              <div className="px-3 py-1.5 rounded-lg bg-muted">Savings</div>
              <div className="text-muted-foreground">&minus;</div>
              <div className="px-3 py-1.5 rounded-lg bg-muted">Spending</div>
              <div className="text-muted-foreground">=</div>
              <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">Money Left</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "Track Every Penny", desc: "Log income and expenses instantly." },
                { title: "Plan Ahead", desc: "Set limits and manage upcoming bills." },
                { title: "Know Your Money Left", desc: "See your truly safe-to-spend balance." }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border shadow-sm">
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need for financial clarity</h2>
            <p className="text-muted-foreground">Powerful features built around a simple philosophy: know what&apos;s yours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wallet, title: "Money Left", desc: "Your primary financial truth. Know exactly what you can safely spend.", featured: true },
              { icon: PieChart, title: "Spending Plan", desc: "Set monthly limits and track your progress effortlessly.", featured: true },
              { icon: Target, title: "Savings Goals", desc: "Visualize and fund your targets with dedicated contributions." },
              { icon: CalendarIcon, title: "Bills Tracking", desc: "Never miss a due date. Track occurrences and mark them paid." },
              { icon: HeartPulse, title: "Financial Health", desc: "Instant diagnosis of your monthly cash flow status." },
              { icon: CalendarIcon, title: "Financial Calendar", desc: "See your past and projected money movement on a grid." },
              { icon: Activity, title: "Spending Calendar", desc: "Track your daily spending habits and zero-spend days." },
              { icon: Bell, title: "Smart Alerts", desc: "Actionable notifications for bills due and plan limits." },
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-2xl border shadow-sm transition-shadow ${
                  feature.featured 
                    ? 'lg:col-span-2 bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50 hover:shadow-emerald-600/10' 
                    : 'bg-card hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  feature.featured 
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className={`font-bold mb-2 ${feature.featured ? 'text-lg' : ''}`}>{feature.title}</h3>
                <p className={`text-muted-foreground ${feature.featured ? 'text-base' : 'text-sm'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full bg-emerald-950 text-white py-24">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Add your activity", desc: "Log your income, expenses, and savings via Quick Add." },
                { step: "2", title: "Track your plan", desc: "Opti-Plan deducts bills and savings to show your Money Left." },
                { step: "3", title: "Stay aware", desc: "Get Smart Alerts and use calendars to guide your spending." },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-xl font-black mb-4 shadow-lg shadow-emerald-500/20">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-emerald-100/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="w-full max-w-5xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-12">Everything you need to know about Opti-Plan.</p>
          <FAQSection />
        </section>

        {/* FINAL CTA */}
        <section className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Take control of your money with more clarity.</h2>
          <p className="text-muted-foreground mb-8">Join today and start your journey towards financial peace of mind.</p>
          <Button asChild size="lg" className="rounded-xl h-14 px-8 text-lg shadow-xl shadow-emerald-600/20">
            <Link href="/signup">Start Seeing Your Money Left</Link>
          </Button>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-border/40 py-8 text-center text-sm text-muted-foreground bg-muted/20">
        <p>&copy; {new Date().getFullYear()} Opti-Plan. All rights reserved.</p>
        <p className="mt-2 text-xs opacity-60">Opti-Plan is a personal finance tool. It is not a bank, does not hold or move money, and does not provide regulated financial advice.</p>
      </footer>
    </div>
  );
}
