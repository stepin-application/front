export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[5%] w-[35vw] h-[35vw] bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-5%] left-[10%] w-[25vw] h-[25vw] bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-[-5%] right-[10%] w-[25vw] h-[25vw] bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      
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