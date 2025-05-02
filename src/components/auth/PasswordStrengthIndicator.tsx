import React from 'react';
import { validatePassword } from '../../lib/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const validation = validatePassword(password);
  const strength = password ? (validation.errors.length === 0 ? 100 : (5 - validation.errors.length) * 20) : 0;

  const getStrengthColor = () => {
    if (strength >= 80) return 'bg-success-500';
    if (strength >= 60) return 'bg-secondary-500';
    if (strength >= 40) return 'bg-warning-500';
    return 'bg-error-500';
  };

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        />
      </div>
      {password && validation.errors.length > 0 && (
        <ul className="mt-2 text-sm text-error-600 space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">•</span>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;