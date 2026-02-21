import { Check } from "lucide-react";

const ServicePackages = ({ services }) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-12 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Services</h2>

      <div className="space_y-4">
        {services.map((service) => (
          <div key={service._id} className="pb-6 border-b border-gray-100 last:border-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-800">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">${service.price}</p>
                {service.duration && (
                  <p className="text-xs text-gray-500">{service.duration}h</p>
                )}
              </div>
            </div>

            {service.features && service.features.length > 0 && (
              <ul className="space-y-1">
                {service.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-gray-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicePackages;
