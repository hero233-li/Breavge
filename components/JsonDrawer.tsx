import React from 'react';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ApiRecord } from '../types';

interface JsonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: ApiRecord | null;
}

const JsonDrawer: React.FC<JsonDrawerProps> = ({ isOpen, onClose, record }) => {
  if (!record) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Transaction Details
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                record.status === 'SUCCESS' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {record.status}
              </span>
            </h2>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Clock size={12}/> {record.latencyMs}ms</span>
              <span>ID: {record.id}</span>
              <span>ENV: {record.environment}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            record.status === 'SUCCESS' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
          }`}>
             {record.status === 'SUCCESS' ? <CheckCircle className="text-green-600 mt-0.5" size={18} /> : <XCircle className="text-red-600 mt-0.5" size={18} />}
             <div>
               <p className={`font-medium ${record.status === 'SUCCESS' ? 'text-green-900' : 'text-red-900'}`}>
                 {record.status === 'SUCCESS' ? 'Execution Successful' : 'Execution Failed'}
               </p>
               <p className={`text-sm mt-1 ${record.status === 'SUCCESS' ? 'text-green-700' : 'text-red-700'}`}>
                 {record.summary}
               </p>
             </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Request Payload</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto custom-scrollbar group relative">
              <pre className="text-xs font-mono text-gray-300 leading-relaxed">
                {JSON.stringify(record.requestPayload, null, 2)}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Response Payload</h3>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto custom-scrollbar group relative">
              <pre className={`text-xs font-mono leading-relaxed ${record.status === 'ERROR' ? 'text-red-300' : 'text-green-300'}`}>
                {JSON.stringify(record.responsePayload, null, 2)}
              </pre>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default JsonDrawer;
