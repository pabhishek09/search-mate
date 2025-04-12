import React, { useEffect, useState } from "react"

const ChatWindow = () => {

    const [ input, setInput ] = useState<string>("");
    const [ message, setMessages] = useState<string[]>([]);

    const getLLMResponse = async (input: string) => {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ msg: input }),
        });
        if (!response.ok) {
            console.error("Error fetching LLM response");
            return;
        }
        const data = await response.json();
        console.log("LLM response: ", data);
        return data?.response?.message;
    }

    const getResponse = async () => {
        const userInput = input;
        if (input.length < 5) {
            console.log("Input is too short");
            return;
        }
        console.log(`Get response from LLM for the input: ${userInput}`);
        const response = await getLLMResponse(userInput);
        const content = response?.content;
        console.log("Response: ", content);
        setMessages((prev) => {
            return [ ...prev, content ]
        });
        setInput("");
    }

    useEffect(() => {

    }, [input]);

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {message.map((msg, index) => (
                    <div key={index} className="chat-message">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input type="text" onChange={(e) => setInput(e?.target?.value)}/>
                <button onClick={getResponse}>Send</button>
            </div>
        </div>
    )
}

export default ChatWindow;
