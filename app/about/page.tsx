"use client";

export default function About() {
  return (
    <main className="min-h-screen py-16 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-2 tracking-wider">
          ABOUT LUMINA
        </h1>
        <p className="text-gray-400 text-sm mb-12 tracking-wide">
          Digital Art Gallery Portfolio Project
        </p>

        <div className="space-y-12">
          {/* Proje Hakkında */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Project Overview
            </h2>
            <p className="text-gray-300 font-light leading-relaxed">
              Lumina is a digital art gallery platform designed as a portfolio
              project to showcase modern web development capabilities. This
              project demonstrates a fully functional e-commerce system for
              digital artworks, featuring user authentication, artwork
              management, and a seamless checkout process.
            </p>
          </div>

          {/* Teknolojiler */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Technologies Used
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-light mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300 font-light">
                  <li>• Next.js</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• Zustand (State Management)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-light mb-4">
                  Backend & Infrastructure
                </h3>
                <ul className="space-y-2 text-gray-300 font-light">
                  <li>• Supabase (Backend as a Service)</li>
                  <li>• PostgreSQL Database</li>
                  <li>• Row Level Security (RLS)</li>
                  <li>• Supabase Auth</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Key Features
            </h2>
            <ul className="space-y-3 text-gray-300 font-light">
              <li>• User authentication and profile management</li>
              <li>• Digital artwork showcase with filtering capabilities</li>
              <li>• Secure checkout process for artwork purchases</li>
              <li>• Admin dashboard for artwork and order management</li>
              <li>• Responsive design for all devices</li>
              <li>• Modern and minimal user interface</li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-light text-white tracking-wider mb-6">
              Contact
            </h2>
            <p className="text-gray-300 font-light leading-relaxed">
              This project was developed by Ahmet Tutsak. For more information
              about my work and other projects, you can reach me through the
              contact page.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
