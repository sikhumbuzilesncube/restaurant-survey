import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Gatekeeper AI</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
            Log in
          </Link>
          <Link href="/login" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-6">
          🚀 The #1 WhatsApp Survey Tool for Restaurants
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
          Turn one-time diners into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
            loyal regulars.
          </span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Capture feedback, recover unhappy customers, and send automated birthday and win-back promotions using the app your customers already use: WhatsApp.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 text-lg">
            Start Free Trial
          </Link>
          <Link href="#features" className="bg-gray-100 text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 text-lg">
            See Features
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to grow</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">Automated WhatsApp Surveys</h3>
              <p className="text-gray-600 text-sm">
                Send a quick emoji survey 30 minutes after a customer leaves. No apps to download, no forms to fill out.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="font-bold text-lg mb-2">Instant Recovery Alerts</h3>
              <p className="text-gray-600 text-sm">
                If a customer leaves a bad rating, your manager gets an instant alert to call them and save the relationship.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-bold text-lg mb-2">Automated Promotions</h3>
              <p className="text-gray-600 text-sm">
                Automatically send birthday discounts and "We Miss You" offers to customers who haven't visited in 30 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Gatekeeper AI. All rights reserved.</p>
      </footer>
    </div>
  );
            }
