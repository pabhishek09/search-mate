import ollama from "ollama";
import config from "../../appConfig";

const chat = async (req, res) => {
    const { msg, model } = req.body;
    const selectedModel = model || config.defaultOllamaModel;
    
    console.log("Chat message:", msg);
    console.log("Using model:", selectedModel);

    try {
        const response = await ollama.chat({
            model: selectedModel,
            messages: [
                { role: "user", content: msg },
            ],
        });
        console.log("Chat response:", response);
        res.status(200).send({ response });
    } catch (error) {
        console.error("Error during chat:", error);
        res.status(500).send({ error: "Failed to get chat response" });
    }
};

const chatStream = async (req, res) => {
    const { msg, model } = req.body;
    const selectedModel = model || config.defaultOllamaModel;
    
    console.log("Chat stream message:", msg);
    console.log("Using model:", selectedModel);

    try {
        // Set appropriate headers for a streaming response
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = await ollama.chat({
            model: selectedModel,
            messages: [
                { role: "user", content: msg },
            ],
            stream: true,
        });

        // Process each chunk from the stream and send it to the client
        for await (const chunk of stream) {
            // Send each chunk as it arrives
            res.write(JSON.stringify(chunk) + '\n');
        }

        // End the response
        res.end();
    } catch (error) {
        console.error("Error during chat stream:", error);
        // Only send error if headers haven't been sent yet
        if (!res.headersSent) {
            res.status(500).send({ error: "Failed to get chat stream response" });
        } else {
            res.end();
        }
    }
};

/**
 * Get a list of all available models installed in Ollama
 */
const getInstalledModels = async (req, res) => {
    try {
        console.log("Fetching installed Ollama models...");
        const models = await ollama.list();
        console.log("Available models:", models);
        res.status(200).send({ models: models.models });
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).send({ error: "Failed to fetch models" });
    }
};

export {
    chat,
    chatStream,
    getInstalledModels
}
