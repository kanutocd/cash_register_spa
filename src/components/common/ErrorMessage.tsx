import { AlertCircle, X } from "lucide-react";

interface ErrorMessageProps {
  message: string | null;
  onDismiss: () => void;
}

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center animate-in">
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-auto text-red-500 hover:text-red-700 flex-shrink-0 transition-colors"
        aria-label="Dismiss error"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;
