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
// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const { LLMChain } = require("langchain/chains");
// const { CallbackManager } = require("langchain/callbacks");
// const {
//   ChatPromptTemplate,
//   HumanMessagePromptTemplate,
//   SystemMessagePromptTemplate,
// } = require("langchain/prompts");
// const { toNodeReadable } = require("web-streams-node");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


function createLLM(conf: any) {
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
  
    let params = {
      temperature: conf.temperature,
      maxTokens: conf.maxTokens,
      topP: conf.topP,
      frequencyPenalty: conf.frequencyPenalty,
      presencePenalty: conf.presencePenalty,
      streaming: true,
      callbackManager: callbackManager,
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo"
    };
  
    switch (conf.model) {
      case "gpt-3.5-turbo":
        params.modelName = "gpt-3.5-turbo";
        llmInstance = new ChatOpenAI(params);
        break;
      case "gpt-4":
        params.modelName = "gpt-4";
        console.log("params:", params);
        llmInstance = new ChatOpenAI(params);
        break;
      default:
        throw new Error(`Unsupported LLM type: ${conf.model}`);
    }
  
    return { llm: llmInstance, stream: stream };
  };
  

  
  
  /**
   * This function exports a chatStream method that configures a conversation with the AI model and returns a NodeReadable stream. (Note that it doesn't return cost or messages)
   * The NodeReadable stream is an object that emits data readable in a Node.js environment, which makes it easy to consume the AI model's responses in real time.
   * 
   * @param {Object} conf Configuration object containing various options for controlling the AI model's responses.
   * @returns {NodeReadable} Returns a NodeReadable stream of responses from the AI model.
   */
  export async function POST(req: Request) {
  
    const body = await req.json();

    const { llm, stream } = createLLM(body);
  
    let {
      temperature = 0.7,
      maxTokens = 200,
      systemPrompt,
      userPrompt,
      model = "gpt-3.5-turbo",
      frequencyPenalty = 0,
      presencePenalty = 0,
      stop = [],
      topP = 1,
      showLogs = false,
    } = conf;
  
    let params = {
      model: model,
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      stop: stop,
    };
  
    if (stop?.length > 0) params.stop = stop;
  
    // if (showLogs) functions.logger.info("gptStream will generate:", { params });
    try {
      const { llm, stream } = await this.createLLM(params);
  
      let promptTemplates = [];
  
      // if (params.systemPrompt) {
      //   promptTemplates.push(
      //     SystemMessagePromptTemplate.fromTemplate(systemPrompt)
      //   );
      // }
  
      // if (params.userPrompt) {
      //   promptTemplates.push(
      //     HumanMessagePromptTemplate.fromTemplate(userPrompt)
      //   );
      // }
  
      promptTemplates.push(
          SystemMessagePromptTemplate.fromTemplate(systemPrompt),
          HumanMessagePromptTemplate.fromTemplate(userPrompt)
      );
  
      console.log("promptTemplates:", promptTemplates);

      llm.call([
        SystemMessagePromptTemplate.fromTemplate(systemPrompt),
        HumanMessagePromptTemplate.fromTemplate(userPrompt)
      ]).catch(console.error)


  
    //   const chain = new LLMChain({
    //     llm,
    //     prompt: ChatPromptTemplate.fromPromptMessages(promptTemplates),
    //   });
  
    //   console.log("chain:", chain);
  
      // Run the chain but don't await it, otherwise the response will start
      // only after the chain is done
    //   chain.call().catch(console.error);
  
    //   console.log("stream:", stream);
  
    //   const nodeReadable = toNodeReadable(stream.readable);
  
    //   console.log("nodeReadable:", nodeReadable);
    return new NextResponse(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
        },
    });
    } catch (error) {
      console.error(error);
    //   throw new Error(error);
    }
  };