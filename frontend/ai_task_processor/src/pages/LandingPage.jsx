import { useState } from 'react';
import AuthModal from '../components/AuthModal';

function LandingPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Top bar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold text-white tracking-tight text-lg">AI Task Processor</span>
        </div>
        <button
          id="landing-login-btn"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-700 rounded-lg hover:border-indigo-500 hover:text-white transition-colors"
        >
          Log In
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Label pill */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Powered by AI Workers
        </span>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5 tracking-tight max-w-3xl">
          Process Tasks{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Asynchronously
          </span>{' '}
          with AI
        </h1>

        <p className="text-lg text-gray-400 max-w-xl mb-10 leading-relaxed">
          Submit text tasks — uppercase, reverse, word count, and more. AI workers
          process them in real time via a Redis-backed queue.
        </p>

        {/* CTA */}
        <button
          id="get-started-btn"
          onClick={() => setShowModal(true)}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 hover:shadow-indigo-500/40"
        >
          Get Started →
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-14">
          {[
            { icon: '🔴', text: 'Redis Queue' },
            { icon: '🐍', text: 'Python Workers' },
            { icon: '🛡️', text: 'JWT Auth' },
            { icon: '⚡', text: 'Real-time Updates' },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg"
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-600 border-t border-gray-900">
        AI Task Processor © {new Date().getFullYear()}
      </footer>

      {/* Auth Modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default LandingPage;
