export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className = "",
}) {
  const baseStyles =
    "font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500 disabled:bg-gray-400 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${
        sizes[size]
      } ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
}
