export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[8%] left-[4%] w-[30vw] h-[30vw] bg-orange-100 dark:bg-orange-400/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 dark:opacity-40 animate-blob"></div>
      <div className="absolute top-[18%] right-[6%] w-[36vw] h-[36vw] bg-amber-100 dark:bg-amber-400/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 dark:opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-6%] left-[12%] w-[26vw] h-[26vw] bg-orange-200 dark:bg-orange-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 dark:opacity-40 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[-6%] right-[8%] w-[24vw] h-[24vw] bg-yellow-100 dark:bg-yellow-400/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 dark:opacity-40 animate-blob animation-delay-6000"></div>

      {/* Motif porte StepIn */}
      <div className="absolute bottom-[6%] left-[50%] -translate-x-1/2 w-[120px] sm:w-[160px] h-[180px] sm:h-[220px] opacity-30 dark:opacity-20">
        <div className="absolute inset-0 rounded-t-[80px] rounded-b-3xl border-2 border-orange-300/40 bg-gradient-to-b from-orange-100/50 to-amber-100/50 shadow-[0_18px_40px_-24px_rgba(234,88,12,0.35)]"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span className="w-5 h-2 rounded-full bg-orange-300/70"></span>
          <span className="w-5 h-2 rounded-full bg-orange-300/70"></span>
          <span className="w-5 h-2 rounded-full bg-orange-300/70"></span>
        </div>
      </div>
      
      {/* Motifs géométriques */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      
      {/* Lignes ondulées */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,128 C100,100 200,150 300,128 C400,100 500,150 600,128" stroke="currentColor" fill="none" className="text-gray-300 dark:text-slate-600" strokeWidth="2"></path>
        <path d="M0,96 C100,150 200,50 300,96 C400,150 500,50 600,96" stroke="currentColor" fill="none" className="text-gray-300 dark:text-slate-600" strokeWidth="2"></path>
      </svg>
    </div>
  )
}
