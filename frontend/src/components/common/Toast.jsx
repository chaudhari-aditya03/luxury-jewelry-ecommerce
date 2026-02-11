import React from 'react';

const Toast = ({ message, type = 'success', autoClose = true, duration = 4000 }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!isVisible) return null;

  const types = {
    success: 'bg-green-50 text-green-900 border-green-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ℹ',
  };

  return (
    <div className={`border rounded-lg p-4 flex items-center gap-3 ${types[type]}`}>
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
