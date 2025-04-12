import ollama from "ollama";
import config from "../../appConfig";

const chat = async (req, res) => {
    const { msg } = req.body;
    console.log("Chat message: ", msg);
    const response = await ollama.chat({
        model: config.defaultOllamaModel,
        messages: [
            { role: "user", content: msg },
        ],
    });
    console.log("Chat response: ", response);
    res.status(200).send({ response });
};

const chatStream = async (msg: string) => {
    const response = await ollama.chat({
        model: config.defaultOllamaModel,
        messages: [
            { role: "user", content: msg },
        ],
        stream: true,
    });
    return response;
};

export {
    chat,
    chatStream,
}
