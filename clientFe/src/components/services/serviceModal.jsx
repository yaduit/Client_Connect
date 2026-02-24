import { X } from 'lucide-react';
import ServiceForm from './serviceForm.jsx';

const ServiceModal = ({ isOpen, onClose, onSuccess, service, provider }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-700/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">{service ? 'Edit Service' : 'Create Service'}</h2>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 transition-colors"><X className="w-4 h-4" /></button>
          </div>

          <ServiceForm
            service={service}
            provider={provider}
            onSuccess={(result) => {
              onSuccess && onSuccess(result);
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
