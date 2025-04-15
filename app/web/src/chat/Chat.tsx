import React, { useEffect, useState } from "react"
import Messages from './messages/Messages'
import Input from './input/Input'

type ModelInfo = {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
        parameter_size: string;
        quantization_level: string;
    }
}

const Chat = () => {

    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<string>("gemma3:12b");
    const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
    const [modelsLoading, setModelsLoading] = useState<boolean>(true);
    const [modelError, setModelError] = useState<boolean>(false);

    // Fetch available models from Ollama
    useEffect(() => {
        const fetchModels = async () => {
            try {
                setModelsLoading(true);
                const response = await fetch('/api/models');
                if (!response.ok) {
                    throw new Error('Failed to fetch models');
                }
                const data = await response.json();
                setAvailableModels(data.models || []);
                
                // Set first model as selected if available
                if (data.models && data.models.length > 0) {
                    setSelectedModel(data.models[0].name);
                }
            } catch (error) {
                setModelError(true);
            } finally {
                setModelsLoading(false);
            }
        };
        
        fetchModels();
    }, []);

    const getLLMResponse = async (input: string, model: string) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    msg: input,
                    model: model
                }),
            });
            if (!response.ok) {
                console.error("Error fetching LLM response");
                setProcessing(false);
                return null;
            }
            
            // Create a temporary message for streaming updates
            setMessages((prev) => [
                ...prev,
                { index: prev.length + 1, sender: 'agent', message: '' }
            ]);
            
            const reader = response.body?.getReader();
            if (!reader) {
                setProcessing(false);
                return null;
            }
            
            let accumulatedMessage = '';
            
            // Process the stream
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                // Convert the bytes to text
                const chunk = new TextDecoder().decode(value);
                try {
                    const data = JSON.parse(chunk);
                    const newContent = data?.message?.content || '';
                    accumulatedMessage += newContent;
                    
                    // Update the last message with accumulated content
                    setMessages((prev) => {
                        const updatedMessages = [...prev];
                        if (updatedMessages.length > 0) {
                            const lastIndex = updatedMessages.length - 1;
                            updatedMessages[lastIndex] = { 
                                ...updatedMessages[lastIndex], 
                                message: accumulatedMessage
                            };
                        }
                        return updatedMessages;
                    });
                } catch (e) {
                    console.error("Error parsing stream chunk:", e);
                }
            }
            
            setProcessing(false);
            return { content: accumulatedMessage };
        } catch (error) {
            console.error("Error during streaming:", error);
            setProcessing(false);
            return null;
        }
    }

    const getResponse = async () => {
        const userInput = input;
        if (input.length < 5) {
            console.log("Input is too short");
            return;
        }
        setMessages((prev) => [
            ...prev,
            { index: prev.length + 1, sender: 'user', message: input}
        ]);
        console.log(`Get response from LLM for the input: ${userInput} using model: ${selectedModel}`);
        
        // getLLMResponse will add the agent message and handle streaming
        await getLLMResponse(userInput, selectedModel);
        
        // Clear the input after sending
        setInput("");
    }

    // Handle file attachment
    const handleAttachment = (file: File) => {
        console.log("File attached:", file.name);
        // Implement file handling logic here
    }

    return (
        <div className="chat-container flex flex-col h-full">
            <div className="text-center py-2">
                <p className="text-xl text text-blue-800">search-mate</p>
            </div>
            <Messages messages={messages} ollamaError={modelError} loading={processing} />
            <Input 
                onInputChange={(val) => setInput(val)} 
                onSend={getResponse} 
                loading={processing}
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
                onAttachment={handleAttachment}
                availableModels={availableModels}
            />
        </div>
    )
}

export default Chat;
