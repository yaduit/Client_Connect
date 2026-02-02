import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProviderHeader = ({ onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center gap-3">
          <button
            onClick={onNavigate || (() => navigate(-1))}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-600 hidden sm:inline">Back</span>
        </div>
      </div>
    </div>
  );
};

export default ProviderHeader;