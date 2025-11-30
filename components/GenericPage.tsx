import React, { useState, useEffect } from 'react';
import { PageConfig, ApiRecord } from '../types';
import { apiService } from '../services/apiService';
import { generateTestData } from '../services/geminiService';
import JsonDrawer from './JsonDrawer';
import { Play, Code, LayoutList, Loader2, FileJson, Sparkles, ChevronRight, Eye } from 'lucide-react';

interface GenericPageProps {
  config: PageConfig;
}

const GenericPage: React.FC<GenericPageProps> = ({ config }) => {
  // State
  const [formData, setFormData] = useState<any>({});
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonString, setJsonString] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ApiRecord | null>(null);

  // Initialize form defaults
  useEffect(() => {
    const defaults: any = {};
    config.fields.forEach(field => {
      defaults[field.name] = field.defaultValue || '';
    });
    setFormData(defaults);
    setJsonString(JSON.stringify(defaults, null, 2));
    setRecords([]); // Clear records when page config changes
  }, [config]);

  // Sync JSON string when form data changes in Form Mode
  useEffect(() => {
    if (!jsonMode) {
      setJsonString(JSON.stringify(formData, null, 2));
    }
  }, [formData, jsonMode]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
    // Try to update form data if valid JSON
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData(parsed);
    } catch (err) {
      // Allow invalid JSON while typing
    }
  };

  const handleAiFill = async () => {
    setAiLoading(true);
    try {
      const data = await generateTestData(config.fields);
      setFormData((prev: any) => ({ ...prev, ...data }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let payload = formData;
      if (jsonMode) {
        try {
          payload = JSON.parse(jsonString);
        } catch (e) {
          alert('Invalid JSON format');
          setLoading(false);
          return;
        }
      }

      const result = await apiService.executeProcess(config.endpoint, config.method, payload);
      setRecords(prev => [result, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-500 mt-1">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {config.method} {config.endpoint}
            </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 p-1.5 rounded-md text-primary">
               {jsonMode ? <Code size={18}/> : <LayoutList size={18}/>}
             </div>
             <h2 className="font-semibold text-gray-800">Request Parameters</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <button
              onClick={handleAiFill}
              disabled={aiLoading || jsonMode} // Disable in JSON mode for simplicity
              className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
             >
               {aiLoading ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
               AI Auto-Fill
             </button>

             <div className="h-4 w-px bg-gray-300 mx-1"></div>

             <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <span className={!jsonMode ? 'text-primary font-medium' : ''}>Form</span>
                <div 
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${jsonMode ? 'bg-primary' : 'bg-gray-300'}`}
                  onClick={() => setJsonMode(!jsonMode)}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${jsonMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className={jsonMode ? 'text-primary font-medium' : ''}>JSON</span>
             </label>
          </div>
        </div>

        <div className="p-6">
          {jsonMode ? (
            <div className="relative">
                <textarea
                  value={jsonString}
                  onChange={handleJsonChange}
                  className="w-full h-64 font-mono text-sm p-4 bg-gray-900 text-gray-100 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none custom-scrollbar"
                  spellCheck={false}
                />
                <div className="absolute top-3 right-3 text-xs text-gray-500 pointer-events-none">
                    JSON Editor
                </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.fields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'select' ? (
                    <div className="relative">
                      <select
                        value={formData[field.name]}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 bg-white border outline-none transition-all"
                      >
                        <option value="">Select an option</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3 border outline-none transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg shadow-sm font-medium transition-all transform active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
              {loading ? 'Executing...' : 'Submit Execution'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {records.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-gray-800">Execution History</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latency</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        record.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(record.timestamp).toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                    {record.summary}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                    {record.latencyMs}ms
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => setSelectedRecord(record)}
                                        className="text-primary hover:text-primary-hover flex items-center gap-1 ml-auto group-hover:underline"
                                    >
                                        <Eye size={14}/> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      <JsonDrawer 
        isOpen={!!selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
        record={selectedRecord} 
      />
    </div>
  );
};

export default GenericPage;
