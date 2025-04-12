import React, { useEffect, useState } from "react"

const Chat = () => {

    const [ input, setInput ] = useState<string>("");
    const [ message, setMessages] = useState<string[]>([]);

    const getResponse = async () => {
        const userInput = input;
        if (input.length < 5) {
            console.log("Input is too short");
            return;
        }
        console.log(`Get response from LLM for the input: ${userInput}`);
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

export default Chat;
