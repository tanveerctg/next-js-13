    import { NextResponse } from "next/server";
    import { ChatOpenAI } from "langchain/chat_models/openai";
    import { OpenAI } from "langchain/llms/openai";
    import { LLMChain } from "langchain/chains";
    import { CallbackManager } from "langchain/callbacks";
    import {
        ChatPromptTemplate,
        HumanMessagePromptTemplate,
        SystemMessagePromptTemplate,
    } from "langchain/prompts";

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    interface Query {
        query: string,
        llmConfig: Config,
    }

    interface Config {
        type: string;
        model: string;
    }

    function createLLM(config: Config) {
        const encoder = new TextEncoder();
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        const callbackManager = CallbackManager.fromHandlers({
            handleLLMNewToken: async (token: string) => {
                await writer.ready;
                await writer.write(encoder.encode(`${token}`));
            },
            handleLLMEnd: async () => {
                await writer.ready;
                await writer.close();
            },
            handleLLMError: async (e: Error) => {
                await writer.ready;
                await writer.abort(e);
            },
        });

        let llmInstance;
        if (config.type === 'openai') {
            switch (config.model) {
                case 'gpt-3.5-turbo':
                    llmInstance = new ChatOpenAI({
                        temperature: 0.9,
                        openAIApiKey: OPENAI_API_KEY,
                        streaming: true,
                        callbackManager: callbackManager,
                        modelName: "gpt-3.5-turbo"
                    });
                    break;

                case "gpt-4":
                    llmInstance = new ChatOpenAI({
                        temperature: 0.9,
                        openAIApiKey: OPENAI_API_KEY,
                        streaming: true,
                        callbackManager: callbackManager,
                        modelName: "gpt-4"
                    });
                    break;
                default:
                    throw new Error(`Unsupported LLM type: ${config.model}`);
            }
        }


        return { llm: llmInstance, stream: stream };

    }


    export async function POST(req: Request) {
        let body: Query;
        try {
            body = await req.json() as Query;
            console.log("body:", body);
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: 'Invalid request body. JSON parsing failed.' }), { status: 400 });
        }

        if (!OPENAI_API_KEY) {
            return new NextResponse(JSON.stringify({ error: 'OPENAI_API_KEY is not defined in the environment.' }), { status: 500 });
        }

        let llm, stream;
        try {
            const llmConfig = body.llmConfig;
            ({ llm, stream } = createLLM(llmConfig));
            console.log("llm:", llm);
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: `LLM creation failed. Details: TODO` }), { status: 500 });
        }

        try {
            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant that answers questions as best you can."),
                HumanMessagePromptTemplate.fromTemplate("{input}"),
            ]);
            if (llm) {
                const chain = new LLMChain({
                    prompt: chatPrompt,
                    llm: llm,
                });
                chain.call({input: body.query}).catch(error => {
                    return new NextResponse(JSON.stringify({ error: `Error during chain call. Details: ${error.message}` }), { status: 500 });
                });
        
                return new NextResponse(stream.readable, {
                    headers: {
                        "Content-Type": "text/event-stream",
                        "Cache-Control": "no-cache",
                    },
                });
            } else {
                return new NextResponse(JSON.stringify({ error: `LLM is undefined.` }), { status: 500 });
            }
            
        
        } catch (error) {
            return new NextResponse(JSON.stringify({ error: `An unexpected error occurred. Details: TODO` }), { status: 500 });
        }
    }

