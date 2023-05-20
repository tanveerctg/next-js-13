import { NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
// import { HuggingFaceInference } from "langchain/llms/hf";
// import { Cohere } from "langchain/llms/cohere";
// import { ChatAnthropic } from "langchain/chat_models/anthropic";

// import { Replicate } from "langchain/llms/replicate";
import { LLMChain } from "langchain/chains";
import { CallbackManager } from "langchain/callbacks";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
} from "langchain/prompts";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { NextRequest } from "next/server";
import { type } from "os";
import { Settings } from "lucide-react";


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//     runtime: "edge",
// };

// export const dynamic = 'auto';
// export const dynamicParams = true;
// export const revalidate = false;
// export const fetchCache = 'auto';
// export const runtime = 'edge';
// export const preferredRegion = 'all';

type Query = {
    query: string
}

function createLLM(config: any) {

    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    const callbackManager = CallbackManager.fromHandlers({
        handleLLMNewToken: async (token) => {
            await writer.ready;
            await writer.write(encoder.encode(`${token}`));
        },
        handleLLMEnd: async () => {
            await writer.ready;
            await writer.close();
        },
        handleLLMError: async (e) => {
            await writer.ready;
            await writer.abort(e);
        },
    });

    let llmInstance;

    switch(config.type) {
        case 'openai':
            llmInstance = new OpenAI({
                temperature: 0.9,
                // openAIApiKey: config.apiKey,
                openAIApiKey: OPENAI_API_KEY,
                streaming: true,
                callbackManager: callbackManager,
            });
            break
        case 'gpt-3.5':
            llmInstance = new OpenAI({
                temperature: 0.9,
                // openAIApiKey: config.apiKey,
                openAIApiKey: OPENAI_API_KEY,
                streaming: true,
                callbackManager: callbackManager,
            });
            break
        case "gpt-3.5-turbo":
            llmInstance = new ChatOpenAI({
                temperature: 0.9,
                // openAIApiKey: config.apiKey,
                openAIApiKey: OPENAI_API_KEY,
                streaming: true,
                callbackManager: callbackManager,
            });
            break
        case "gpt-4":
            llmInstance = new ChatOpenAI({
                temperature: 0.9,
                // openAIApiKey: config.apiKey,
                openAIApiKey: OPENAI_API_KEY,
                streaming: true,
                callbackManager: callbackManager,
            });
            break
        

        // case 'azure':
        //     llmInstance =  new OpenAI({
        //         temperature: 0.9,
        //         azureOpenAIApiKey: config.apiKey,
        //         azureOpenAIApiInstanceName: config.instanceName,
        //         azureOpenAIApiDeploymentName: config.deploymentName,
        //         azureOpenAIApiVersion: config.apiVersion,
        //         streaming: true,
        //         callbackManager: callbackManager,
        //     });
        //     break;
        // case 'huggingface':
        //     // Adjust as needed for HuggingFace
        //     // If the HuggingFace LLM supports callbacks, add them here
        //     llmInstance =  new HuggingFaceInference({
        //         model: 'gpt2',
        //         apiKey: config.apiKey,
        //     });
        //     break;
        // case 'cohere':
        //     // Adjust as needed for Cohere
        //     // If the Cohere LLM supports callbacks, add them here
        //     llmInstance =  new Cohere({
        //         maxTokens: 20,
        //         apiKey: config.apiKey,
        //     });
        //     break;
        // case 'replicate':
        //     // Adjust as needed for Replicate
        //     // If the Replicate LLM supports callbacks, add them here
        //     llmInstance =  new Replicate({
        //         model: config.model,
        //         apiKey: config.apiKey,
        //     });
        //     break;
        default:
            throw new Error(`Unsupported LLM type: ${config.type}`);
    
    }

    return { llm: llmInstance, stream: stream };

}


// Post req:
// query: String
// llmConfig: 
//    type
//    Settings
// usePrevious: boolean
// previousOuputs: string



export async function POST(req: Request) {
    // const body = await req.json();  
    // console.log(body)   
    // console.log(req)
    try {
    console.log("trying to get query")
    // const body = await req.json();
    const body = await req.json();

    const { llm, stream } = createLLM(body.llmConfig);

    // check what kind of model we are using

    console.log(body)

    try {
        if (!OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not defined.");
        }

      

        // const llm = new OpenAI({
        //     openAIApiKey: OPENAI_API_KEY,
        //     temperature: 0.9,
        //     streaming: true,
        //     callbackManager: CallbackManager.fromHandlers({
        //         handleLLMNewToken: async (token) => {
        //             await writer.ready;
        //             await writer.write(encoder.encode(`${token}`));
        //         },
        //         handleLLMEnd: async () => {
        //             await writer.ready;
        //             await writer.close();
        //         },
        //         handleLLMError: async (e) => {
        //             await writer.ready;
        //             await writer.abort(e);
        //         },
        //     }),
        // });

        // const chain = new LLMChain({ prompt, llm });
        // chain.call({ query: query }).catch(console.error);

        // We can also construct an LLMChain from a ChatPromptTemplate and a chat model.
        const chatPrompt = ChatPromptTemplate.fromPromptMessages([
            SystemMessagePromptTemplate.fromTemplate(
                "You are a helpful assistant that answers questions as best you can."
            ),
            HumanMessagePromptTemplate.fromTemplate("{input}"),
        ]);
        const chain = new LLMChain({
            prompt: chatPrompt,
            llm: llm,
        });
        chain
            .call({input: body.query})
            .catch(console.error);

        return new NextResponse(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        // console.error(error);
        // res.status(500).send("Internal Server Error");
        return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
    }
    } catch (error) {
        // console.error(error);
        // res.status(500).send("Internal Server Error");
        return new NextResponse(JSON.stringify({ error: 'could not read json'}), { status: 500 });
    }
}



// import { NextResponse } from 'next/server';
 
// export async function POST(request: Request) {
//   const res = await request.json();
//   return NextResponse.json({ success: true, data: res });
//   }


// {
//     "model": "davinci",
//     config: {
//         "temperature": 0.9,
//         "max_tokens": 150,
//         "top_p": 1,
//         "frequency_penalty": 0.0,
//         "presence_penalty": 0.6,
//         "stop": ["\n", " Human:", " AI:"]

//     }
// }


// ==> ReadableStream