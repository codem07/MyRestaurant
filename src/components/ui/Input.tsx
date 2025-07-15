import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<any>>;
export default Input; 