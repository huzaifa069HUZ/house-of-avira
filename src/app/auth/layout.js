import { ShaderBackground } from "@/components/ui/red-in-black";

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      <ShaderBackground
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 max-w-md w-full space-y-8 bg-black/40 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20">
        {children}
      </div>
    </div>
  );
}
