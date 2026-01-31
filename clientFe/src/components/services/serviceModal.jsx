import { X } from 'lucide-react';
import ServiceForm from './serviceForm.jsx';

const ServiceModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Create Service</h2>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
          </div>

          <ServiceForm
            onSuccess={(created) => {
              onSuccess && onSuccess(created);
              onClose && onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </>
  );
};

export default ServiceModal;