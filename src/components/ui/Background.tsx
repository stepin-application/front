export default function Background() {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-56 h-56 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 right-20 w-56 h-56 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      
      {/* Motifs géométriques */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-200 rounded-full"></div>
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-200 rounded-full"></div>
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gray-200 rounded-full"></div>
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-gray-200 rounded-full"></div>
      
      {/* Lignes ondulées */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,128 C100,100 200,150 300,128 C400,100 500,150 600,128" stroke="currentColor" fill="none" className="text-gray-300" strokeWidth="2"></path>
        <path d="M0,96 C100,150 200,50 300,96 C400,150 500,50 600,96" stroke="currentColor" fill="none" className="text-gray-300" strokeWidth="2"></path>
      </svg>
    </div>
  )
}