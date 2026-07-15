import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isFocused?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

// Используем forwardRef для поддержки ref
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input {...props} ref={ref} />;
});

Input.displayName = 'Input';

export default Input;