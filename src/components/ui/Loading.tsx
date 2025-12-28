interface LoadingProps {
  text?: string;
  fullscreen?: boolean;
}

export default function Loading({
  text = "Cargando…",
  fullscreen = false,
}: LoadingProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gray-600
        ${fullscreen ? "fixed inset-0 bg-white/70 backdrop-blur z-50" : "py-10"}
      `}
    >
      <span className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
