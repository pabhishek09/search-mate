import React, { useRef, useEffect } from "react";

type ModelInfo = {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parameter_size: string;
    quantization_level: string;
  };
};

const Input = ({
  onInputChange,
  onSend,
  loading,
  selectedModel = "gemma3:12b",
  onModelSelect,
  onAttachment,
  availableModels = [],
}: {
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  selectedModel?: string;
  onModelSelect?: (model: string) => void;
  onAttachment?: (file: File) => void;
  availableModels?: ModelInfo[];
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to adjust textarea height based on content
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  };

  // Adjust height on input change
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(e.target.value);
    adjustTextareaHeight();
  };

  // Initialize height
  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  // Handle file attachment
  const handleAttachment = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAttachment) {
      onAttachment(file);
    }
  };

  useEffect(() => {
    if (!loading) {
        if (textareaRef.current) {
          textareaRef.current.value = ""; // Clear the textarea when loading is false
        }
    }
  }, [loading]);

  return (
    <div className="input-container rounded-xl border-2 border-solid border-blue-800 px-8 py-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="input-text flex-1">
          <textarea
            ref={textareaRef}
            className="w-full text-blue-800 outline-none overflow-y-hidden overflow-x-hidden py-1 resize-none min-h-[40px]"
            placeholder="Type a question"
            onChange={handleInput}
            disabled={loading}
            rows={1}
          />
        </div>
      </div>
      <div className="actions flex justify-between">
        <div>
          <button
            className="text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors"
            onClick={handleAttachment}
            title="Attach files"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
          </button>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="flex justify-end gap-4">
          <select
            className="border border-blue-800 text-blue-800 rounded-md px-2 py-1.5 text-sm focus:outline-none"
            value={selectedModel}
            onChange={(e) => onModelSelect && onModelSelect(e.target.value)}
          >
            {availableModels.length === 0 && (
              <option disabled value="">Loading models</option>
            )}
            {availableModels.map((model) => (
              <option key={model.name} value={model.name}>
                {model.name}
                {model.details?.parameter_size
                  ? ` (${model.details.parameter_size})`
                  : ""}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            onClick={onSend}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Input;
