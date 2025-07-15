import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef<HTMLInputElement, any>(({
    className,
    id,
    checked,
    indeterminate = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    size = "default",
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Size variants
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6"
    };

    return (
        <div className={cn("flex items-start gap-3", className)}>
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    id={checkboxId}
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    aria-checked={indeterminate ? "mixed" : checked}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${checkboxId}-error` : undefined}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                    {...props}
                />
                <label
                    htmlFor={checkboxId}
                    className={cn(
                        "flex items-center justify-center rounded border transition-colors duration-150 cursor-pointer select-none",
                        "border-primary bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
                        sizeClasses[size],
                        checked && "bg-primary text-white border-primary",
                        indeterminate && "bg-primary text-white border-primary",
                        error && "border-destructive",
                        disabled && "cursor-not-allowed opacity-50"
                    )}
                    tabIndex={0}
                >
                    {checked && !indeterminate && (
                        <Check className="h-3 w-3" />
                    )}
                    {indeterminate && (
                        <Minus className="h-3 w-3" />
                    )}
                </label>
            </div>

            {(label || description || error) && (
                <div className="flex-1 space-y-1">
                    {label && (
                        <label
                            htmlFor={checkboxId}
                            className={cn(
                                "text-sm font-medium leading-none cursor-pointer",
                                error ? "text-destructive" : "text-foreground",
                                disabled && "cursor-not-allowed opacity-70"
                            )}
                        >
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </label>
                    )}
                    {description && !error && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                    {error && (
                        <p id={`${checkboxId}-error`} className="text-xs text-destructive">{error}</p>
                    )}
                </div>
            )}
        </div>
    );
});

Checkbox.displayName = "Checkbox";

// Checkbox Group component
const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, any>(({
    className,
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    ...props
}, ref) => {
    return (
        <fieldset
            ref={ref}
            disabled={disabled}
            className={cn("space-y-3", className)}
            aria-invalid={!!error}
            {...props}
        >
            {label && (
                <legend className={cn(
                    "text-sm font-medium",
                    error ? "text-destructive" : "text-foreground"
                )}>
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </legend>
            )}

            {description && !error && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}

            <div className="space-y-2">
                {children}
            </div>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </fieldset>
    );
});

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup }; 