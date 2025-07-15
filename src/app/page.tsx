"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-800 mb-4 drop-shadow-lg">
          RecipeMaster
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-2xl mx-auto">
          The all-in-one restaurant management platform. <br />
          <span className="text-blue-600 font-semibold">Empower your team. Delight your guests.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button
            onClick={() => signIn("google")}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.547z" fill="#fff"/>
                <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.87.61-2.02.99-3.469.99-2.664 0-4.922-1.8-5.734-4.22h-3.203v2.65c1.646 3.25 5.09 5.57 9.937 5.57z" fill="#34A853"/>
                <path d="M6.306 13.78c-.2-.6-.316-1.24-.316-1.78s.116-1.18.316-1.78v-2.65h-3.203c-.65 1.3-1.02 2.74-1.02 4.43s.37 3.13 1.02 4.43l3.203-2.65z" fill="#FBBC05"/>
                <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.547z" fill="#4285F4"/>
                <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.87.61-2.02.99-3.469.99-2.664 0-4.922-1.8-5.734-4.22h-3.203v2.65c1.646 3.25 5.09 5.57 9.937 5.57z" fill="none"/>
              </g>
            </svg>
            Login with Google
          </button>
          <Link
            href="/subscription"
            className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-50 transition"
          >
            See Plans
          </Link>
          <a
            href="#features"
            className="inline-block border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-50 transition"
          >
            See Features
          </a>
        </div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-b-3xl -z-10" />
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-800">
          Why Choose RecipeMaster?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Order Management"
            desc="Create, track, and manage customer orders with real-time updates for your team."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path d="M12 3v18M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Kitchen Display"
            desc="Seamless kitchen interface for chefs. Prioritize, execute, and complete recipes efficiently."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Inventory Tracking"
            desc="Monitor stock levels, get low-stock alerts, and manage suppliers from one dashboard."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M8 8h8v8H8z" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            title="Table Management"
            desc="Visualize and manage your restaurant floor plan. Optimize seating and reservations."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5-5 5 5M12 17V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Analytics & Reports"
            desc="Gain insights with real-time analytics and customizable reports for smarter decisions."
          />
          <FeatureCard
            icon={
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            title="User Roles & Permissions"
            desc="Control access for admins, chefs, waiters, and managers. Secure and flexible."
          />
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-20 px-4 mt-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-blue-800">Choose Your Plan</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Free Plan */}
          <PlanCard
            name="Free"
            price="$0"
            features={["Up to 10 recipes", "Basic order management", "1 admin user"]}
            button="Get Started"
            link="/subscription"
          />
          {/* Pro Plan */}
          <PlanCard
            name="Pro"
            price="$29"
            highlight
            features={[
              "Unlimited recipes",
              "Advanced kitchen & inventory",
              "Analytics & reports",
              "Up to 5 team members",
            ]}
            button="Upgrade to Pro"
            link="/subscription"
          />
          {/* Enterprise Plan */}
          <PlanCard
            name="Enterprise"
            price="Custom"
            features={[
              "All Pro features",
              "Custom integrations",
              "Priority support",
              "Unlimited team members",
            ]}
            button="Contact Sales"
            link="/subscription"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm mt-auto">
        &copy; {new Date().getFullYear()} RecipeMaster. All rights reserved.
        <div className="flex justify-center gap-4 mt-2">
          <a href="https://twitter.com/" target="_blank" rel="noopener" className="hover:underline text-blue-600">Twitter</a>
          <a href="https://facebook.com/" target="_blank" rel="noopener" className="hover:underline text-blue-600">Facebook</a>
          <a href="mailto:support@recipemaster.com" className="hover:underline text-blue-600">Contact</a>
        </div>
      </footer>
    </div>
  );
}

// FeatureCard component
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center hover:shadow-lg transition">
      <span className="mb-4 text-blue-600">{icon}</span>
      <h3 className="font-semibold text-lg mb-2 text-blue-800">{title}</h3>
      <p className="text-gray-700 text-center">{desc}</p>
    </div>
  );
}

// PlanCard component
function PlanCard({
  name,
  price,
  features,
  button,
  link,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
  button: string;
  link: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl shadow p-10 flex flex-col items-center border-2 ${
        highlight
          ? 'bg-blue-600 text-white border-blue-600 scale-105 z-10'
          : 'bg-white border-blue-200'
      }`}
    >
      {highlight && (
        <span className="mb-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold uppercase">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p className="text-4xl font-extrabold mb-4">{price}{name !== 'Enterprise' && <span className="text-base font-medium">/mo</span>}</p>
      <ul className="mb-6 space-y-2 text-center">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <Link
        href={link}
        className={`px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 hover:text-white transition ${
          highlight
            ? 'bg-white text-blue-600 hover:bg-blue-600 hover:text-white'
            : 'bg-blue-600 text-white'
        }`}
      >
        {button}
      </Link>
    </div>
  );
}
