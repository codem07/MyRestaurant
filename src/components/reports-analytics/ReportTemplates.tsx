import React from 'react';

export interface ReportTemplatesProps {
  templates?: { name: string; description: string }[];
  onSelectTemplate?: (template: string) => void;
}

const ReportTemplates: React.FC<ReportTemplatesProps> = ({ templates = [], onSelectTemplate }) => {
  return (
    <div className="bg-gray-50 p-4 rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">Report Templates</h2>
      <ul>
        {templates.map((template) => (
          <li key={template.name} className="mb-2">
            <button
              className="w-full text-left px-3 py-2 rounded bg-gray-200 hover:bg-blue-500 hover:text-white transition"
              onClick={() => onSelectTemplate?.(template.name)}
            >
              <div className="font-bold">{template.name}</div>
              <div className="text-sm text-gray-600">{template.description}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportTemplates; 