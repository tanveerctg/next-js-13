import { NextResponse } from "next/server";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { OpenAI } from "langchain/llms/openai";
// import { LLMChain } from "langchain/chains";
// import { CallbackManager } from "langchain/callbacks";
// import {
//     ChatPromptTemplate,
//     HumanMessagePromptTemplate,
//     SystemMessagePromptTemplate,
// } from "langchain/prompts";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


// function createLLM() {

//     return new ChatOpenAI({
//         temperature: 0.9,
//         openAIApiKey: OPENAI_API_KEY,
//         streaming: true,
//         modelName: "gpt-3.5-turbo"
//     });

// }

// interface Query {
//     query: string,
// }


// export async function POST(req: Request) {
//     let body: Query;
//     try {
//         body = await req.json() as Query;
//         console.log("body:", body);
//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: 'Invalid request body. JSON parsing failed.' }), { status: 400 });
//     }

//     if (!OPENAI_API_KEY) {
//         return new NextResponse(JSON.stringify({ error: 'OPENAI_API_KEY is not defined in the environment.' }), { status: 500 });
//     }

//     let llm;
//     try {
//         const llm = createLLM();
//         console.log("llm:", llm);
//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: `LLM creation failed. Details: TODO` }), { status: 500 });
//     }

//     try {
//         const chatPrompt = ChatPromptTemplate.fromPromptMessages([
//             SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant that answers questions as best you can."),
//             HumanMessagePromptTemplate.fromTemplate("{input}"),
//         ]);
//         if (llm) {
//             const chain = new LLMChain({
//                 prompt: chatPrompt,
//                 llm: llm,
//             });
//             const result = chain.call({input: body.query}).catch(error => {
//                 return new NextResponse(JSON.stringify({ error: `Error during chain call. Details: ${error.message}` }), { status: 500 });
//             });
            
//             return new NextResponse(JSON.stringify({ result: result }), { status: 200 });
            
//         } else {
//             return new NextResponse(JSON.stringify({ error: `LLM is undefined.` }), { status: 500 });
//         }
        
    
//     } catch (error) {
//         return new NextResponse(JSON.stringify({ error: `An unexpected error occurred. Details: TODO` }), { status: 500 });
//     }
// }


import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";




const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: Request) {
    console.log("improve request received: ", req)
    if (!OPENAI_API_KEY) {
        return new NextResponse(JSON.stringify({ error: 'OPENAI_API_KEY is not defined in the environment.' }), { status: 500 });
    }

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Invalid request body. JSON parsing failed.' }), { status: 400 });
    }

    try {
        const chat = new ChatOpenAI({ temperature: .9, streaming: false });
        const newQueryPrompt = `A user is interacting with an AI system, and wants to get a good response. However, their query is not very good. Improve their query so that the AI system would better understand what they want. ONLY RETURN THE IMPROVED QUERY, AND NOTHING ELSE. 
        Example of a bad response from you: "An improved query would be: 'Create a thorough and detailed report on the current state of the company's finances.". Example of a good response from you: "Create a thorough and detailed report on the current state of the company's finances."`;
        const newQuery = `${newQueryPrompt}\n\nHuman: ${body.query}\n\nImproved Query:`;
        const response = await chat.call([
            new HumanChatMessage(newQuery)
        ]);
    

        return new NextResponse(JSON.stringify({ result: response }), { status: 200 });

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: `An unexpected error occurred. Details: TODO}` }), { status: 500 });
        return;
    }
}

