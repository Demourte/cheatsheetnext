import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;
  
  const getButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'info':
        return 'btn-info';
      default:
        return 'btn-error';
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="modal-box relative">
          <button 
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onCancel}
          >
            <X size={16} />
          </button>
          
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="py-4">{message}</p>
          
          <div className="modal-action">
            <button 
              className="btn btn-outline"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            <button 
              className={`btn ${getButtonClass()}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
