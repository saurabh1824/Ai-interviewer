import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon,
  type = 'button',
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "transform hover:scale-105";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;