import { CelestialSphere } from "@/components/ui/celestial-sphere";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      <CelestialSphere
        hue={210.0}
        speed={0.4}
        zoom={1.2}
        particleSize={4.0}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
        {children}
      </div>
    </div>
  );
}
