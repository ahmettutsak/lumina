export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-4">
        <h1 className="md:text-9xl text-6xl font-bold text-white mb-8 tracking-wider">
          LUMINA
        </h1>
        <p className="md:text-lg text-gray-300 mb-12 tracking-wide max-w-xl mx-auto font-light">
          Where Digital Art Transcends Reality
        </p>
        <button className="group relative px-12 py-4 overflow-hidden rounded-full transition-all duration-300">
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out group-hover:w-full" />
          <span className="relative text-white text-lg font-light tracking-wider">
            Enter Gallery
          </span>
        </button>
      </div>
    </section>
  );
}
