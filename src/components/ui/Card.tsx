import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  footer?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-gray-200 bg-white shadow-sm',
          className
        )}
        {...props}
      >
        {title && (
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          </div>
        )}
        <div className="p-4">{children}</div>
        {footer && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
Card.displayName = 'Card';
