import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 px-6 py-24 relative overflow-hidden bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-4xl text-center space-y-8 z-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 mb-4 shadow-sm animate-pulse">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-none">
          Smart Campus <br />
          <span className="bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">Service Hub</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 leading-relaxed font-medium">
          The single digital home for college students. Get real-time administrative notices, raise complaints, and report lost & found items instantly.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            href="/auth/login"
            className="flex items-center justify-center h-12 px-8 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-md shadow-cyan-500/10 transition-all text-sm w-full sm:w-auto hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            Enter Platform
          </Link>
          <Link
            href="/auth/register"
            className="flex items-center justify-center h-12 px-8 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold shadow-sm transition-all hover:bg-slate-50 text-sm w-full sm:w-auto hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            Create Student Account
          </Link>
        </div>

        {/* Feature Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-lg">📢</span> Notice Board
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              Never miss college announcements, event notices, or scheduled facility updates again.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-lg">🛠️</span> Complaint Lodging
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              Report Wi-Fi drops, hostel damage, or classroom issues directly to system admins.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span className="text-lg">🔍</span> Lost & Found
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
              Easily check, report, and claim lost campus belongings with exact location logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
