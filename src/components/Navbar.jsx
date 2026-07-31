import React from 'react';
import { Database, ShieldCheck, Code2, Github } from 'lucide-react';

export default function Navbar({ onOpenCodeModal }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* macOS Traffic Lights & Title */}
          <div className="flex items-center space-x-4">
            {/* macOS Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-black/20" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-black/20" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-black/20" />
            </div>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            {/* Brand Title */}
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Database className="w-4 h-4 text-[#ff3b30]" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-white font-sans">
                rag-rbbieee
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono font-medium border border-white/10">
                Visualizer
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff3b30]" />
              <span>100% Client-Side</span>
            </div>

            <button
              onClick={onOpenCodeModal}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 hover:text-white border border-white/[0.1] transition-all text-xs font-medium"
            >
              <Code2 className="w-3.5 h-3.5 text-[#ff3b30]" />
              <span className="hidden sm:inline">Source Logic</span>
            </button>

            <a
              href="https://github.com/rbbieee/rag-rbbieee"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-300 hover:text-white border border-white/[0.1] transition-all"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
