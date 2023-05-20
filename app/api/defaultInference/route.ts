// import { Configuration, OpenAIApi } from 'openai-edge';

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// })
// const openai = new OpenAIApi(config);

// export const runtime = 'edge';

// export default async function Page() {
//   const response = await openai.createChatCompletion({
//      model: 'gpt-3.5-turbo',
//      messages: [{ role: 'user', content: '' }],
//      max_tokens: 200,
//      temperature: 0.7,
//      top_p: 1,   
//      frequency_penalty: 1,presence_penalty: 1,
            
//   });
//   const result = await response.json();
//   return <div>{result.choices[0].message.content}</div>
// }


// import { NextApiRequest, NextApiResponse } from 'next';

// // Import the libraries for the APIs
// import { Configuration, OpenAIApi } from 'openai-edge';
// import fetch from 'node-fetch';

// // Create the configuration for the OpenAI API
// const openaiConfig = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(openaiConfig);

// // Constants for the Anthropic API
// const HUMAN_PROMPT = '\n\nHuman:';
// const AI_PROMPT = '\n\nAssistant:';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { llmType } = req.query;
//   const { input } = req.body;

//   try {
//     if (llmType === 'openai') {
//       // Call the OpenAI API
//       const response = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: input }],
//         max_tokens: 200,
//         temperature: 0.7,
//         top_p: 1,
//         frequency_penalty: 1,
//         presence_penalty: 1,
//       });

//       const result = await response.json();
//       return res.status(200).json(result.choices[0].message.content);
//     }

//     if (llmType === 'anthropic') {
//       // Call the Anthropic API
//       const response = await fetch('https://api.anthropic.com/v1/complete', {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Client: 'anthropic-typescript/0.4.3',
//           'X-API-Key': process.env.ANTHROPIC_API_KEY,
//         },
//         body: JSON.stringify({
//           model: 'claude-v1',
//           prompt: `${HUMAN_PROMPT}${input}${AI_PROMPT}`,
//           max_tokens_to_sample: 200,
//           stop_sequences: [HUMAN_PROMPT],
//           temperature: 1,
//           top_k: 1,
//           top_p: 1,
//         }),
//       });

//       const result = await response.json();
//       return res.status(200).json(result.completion);
//     }

//     return res.status(400).json({ error: `Unsupported LLM type: ${llmType}` });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }
    