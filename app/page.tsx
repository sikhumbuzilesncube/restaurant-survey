import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Gatekeeper</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-gray-900">Platform</Link>
              <Link href="#integrations" className="text-sm font-medium text-gray-500 hover:text-gray-900">Integrations</Link>
              <Link href="#results" className="text-sm font-medium text-gray-500 hover:text-gray-900">Case Studies</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Log in
              </Link>
              <Link href="/login" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Get a Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            The #1 WhatsApp Feedback Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Feedback In. <span className="text-blue-600">Results Out.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Know where your guest experience is falling short and how to fix it. Powered by real-time WhatsApp feedback and automated recovery.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg shadow-sm">
              Watch Demo
            </Link>
            <Link href="/login" className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-lg">
              Contact Sales
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              250+ Brands
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              15.8B+ Data Points
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              SOC2 Compliant
            </div>
          </div>
        </div>
      </section>

      {/* Logos (Placeholder) */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-widest">Trusted by leading brands worldwide</p>
          <div className="flex flex-wrap justify-center gap-10 opacity-50 grayscale">
            {/* Placeholder text for logos */}
            <span className="text-2xl font-bold font-serif">Restaurant A</span>
            <span className="text-2xl font-bold font-serif">Burger Co.</span>
            <span className="text-2xl font-bold font-serif">Cafe 99</span>
            <span className="text-2xl font-bold font-serif">The Grill</span>
            <span className="text-2xl font-bold font-serif">Pizza Hub</span>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section id="results" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">Impact Metrics</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Real guest experience results</h3>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Clear gains across feedback, recovery, and operations.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-4xl font-extrabold text-blue-600 mb-2">34%</p>
              <p className="text-sm font-semibold text-gray-600">Average Increase in Customer Experience Rating</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-4xl font-extrabold text-blue-600 mb-2">171%</p>
              <p className="text-sm font-semibold text-gray-600">Increase in Transaction Count</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-4xl font-extrabold text-blue-600 mb-2">97%+</p>
              <p className="text-sm font-semibold text-gray-600">Average Survey Completion Rate</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
              <p className="text-4xl font-extrabold text-blue-600 mb-2">1 in 3</p>
              <p className="text-sm font-semibold text-gray-600">Unhappy Guests Recovered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">All-in-one Solution</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Built to help you actually improve</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Feedback Collection</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Collect real-time feedback from your guests automatically via WhatsApp.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Smart Insights</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Understand performance trends and find the real issues behind the satisfaction ratings.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Guest Recovery</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Resolve issues and win back guests with instant manager alerts before they leave bad reviews.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Review Management</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Monitor, respond, and boost ratings across every major review site—all from one place.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Automated Promotions</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Send birthday discounts and win-back offers automatically to keep guests coming back.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              </div>
              <h4 className="text-xl font-bold mb-3">Item-Level Feedback</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Know which menu items are making or breaking guest experiences—and how to make adjustments.</p>
              <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more <span aria-hidden="true">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">See Gatekeeper in Action</h2>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
            Get an in-depth look at the platform that drives data-backed decision-making for restaurant operators.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <input type="email" placeholder="Enter your work email" className="px-6 py-3 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Start Watching
            </button>
          </div>
          <p className="mt-4 text-sm text-blue-200">Free 30-day trial. No credit card required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-bold text-xl text-white">Gatekeeper</span>
            </div>
            <p className="text-sm text-gray-500">The #1 WhatsApp Feedback Engine for modern restaurants.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Feedback Collection</Link></li>
              <li><Link href="#" className="hover:text-white">Smart Insights</Link></li>
              <li><Link href="#" className="hover:text-white">Guest Recovery</Link></li>
              <li><Link href="#" className="hover:text-white">Automated Promotions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white">Data Processing</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; {new Date().getFullYear()} Gatekeeper AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
        }
