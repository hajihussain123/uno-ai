export default function Input({
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  error = null,
  maxLength = null,
  className = "",
  autoFocus = false,
  onKeyPress = null,
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        onKeyPress={onKeyPress}
        className={`
          w-full
          px-4
          py-2.5
          rounded-lg
          border-2
          transition
          duration-200
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
          disabled:bg-gray-100
          disabled:cursor-not-allowed
          ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        }
          ${className}
        `}
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}
      </p>}
    </div>
  );
}
