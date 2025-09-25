import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;

    const baseInputStyles = `
      block
      w-full
      px-4
      py-2
      text-gray-900
      placeholder-gray-500
      bg-white
      border
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-offset-1
      disabled:bg-gray-100
      disabled:cursor-not-allowed
    `;

    const stateStyles = hasError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

    const iconPaddingStyles = leftIcon ? 'pl-10' : '' + rightIcon ? 'pr-10' : '';

    const inputClassName = `
      ${baseInputStyles}
      ${stateStyles}
      ${iconPaddingStyles}
      ${className}
    `.trim();

    const containerClassName = fullWidth ? 'w-full' : 'inline-block';

    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{leftIcon}</span>
            </div>
          )}

          <input
            ref={ref}
            className={inputClassName}
            aria-invalid={hasError}
            aria-describedby={error ? 'error-message' : helperText ? 'helper-text' : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{rightIcon}</span>
            </div>
          )}
        </div>

        {error && (
          <p id="error-message" className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id="helper-text" className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;