import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  AdjustmentsHorizontalIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid"
import TextareaAutosize from "react-textarea-autosize"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Model {
  name: string
  provider: string
  description: string
  settings: Record<string, any>
  result: string
  modelChoices: {
    name: string
    provider: string
    description: string
    defaultSettings: Record<string, any>
  }[]
}


interface Query {
  query: string,
  llmConfig: Config,
}

interface Config {
  type: string;
  apiKey?: string;
  instanceName?: string;
  deploymentName?: string;
  apiVersion?: string;
  model?: string;
}

const Header: FC = () => (
  <div className="flex h-16 w-full items-center justify-between bg-white px-10 text-gray-700 shadow">
    <h1 className="text-2xl font-bold">AI Model Comparison</h1>
    <div className="flex items-center space-x-4">
      <div className="text-sm">User: John Doe</div>
      <Button variant="outline">Logout</Button>
    </div>
  </div>
)

function ModelCard({
  modelName,
  modelInference,
  onDelete,
  model,
}: {
  modelName: string
  modelInference: string
  onDelete: () => void
  model: {
    name: string
    provider: string
    description: string
    settings: Record<string, any>
    result: string
    modelChoices: Record<string, any>
  }
}) {
  const [loading, setLoading] = useState(false)
  const [modelResults, setModelResults] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState(modelName)

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full flex-col rounded bg-white shadow-md">
        {/* 
      <div className="flex flex-col h-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-300 to-gray-200 px-4 py-2 sticky top-0 z-10"> */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-gray-200 px-4 py-2 text-gray-700">
          <div className="flex items-center space-x-2">
            {/* <span className="font-semibold">Model: {modelName}</span> */}
            <div className="w-1/2">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[180px] rounded-md border border-gray-300 px-2 py-1">
                  <SelectValue>{selectedModel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {model.modelChoices.map((choice: any, index: any) => (
                    <SelectItem
                      key={index}
                      value={choice.name}
                      className="hover:bg-gray-100"
                    >
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded border border-gray-500 px-2 py-1 text-gray-500 hover:border-indigo-600 hover:text-indigo-600">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-grow overflow-auto p-4">
          {/* Model results go here */}
          {modelInference}
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          {/* Settings Button */}

          {/* Full View Button */}
          <button className="rounded border border-gray-300 px-2 py-1 text-gray-700 hover:border-gray-800 hover:bg-gray-500 hover:text-gray-800 hover:text-white">
            View Full
          </button>
        </div>
      </div>
    </div>
  )
}

interface FooterProps {
  onRun: (inputText: string) => void
  onRunAll: (inputText: string) => void
  onRunImproved: (inputText: string) => void
  inputText: string
  setInputText: (inputText: string) => void
  addModel: () => void
}

const Footer: FC<FooterProps> = ({
  onRun,
  onRunAll,
  onRunImproved,
  inputText,
  setInputText,
  addModel,
}) => {
  const handleRunClick = () => {
    onRun(inputText)
  }

  const handleRunAllClick = () => {
    onRunAll(inputText)
  }

  const handleRunImprovedClick = () => {
    onRunImproved(inputText)
  }


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }

  return (
    <div className="flex flex-col items-stretch justify-between bg-white shadow-lg sticky bottom-0 z-1 relative h-1/4 backdrop-blur outline-none border-t border-gray-200">

<div className=" top-2 left-2 text-sm text-gray-400 p-3">
    ✨ proompt here ✨
  </div>
      {/* <textarea
        className="flex-grow border-0 overflow-auto focus:outline-none shadow-none resize-none rounded-none h-full p-6 !outline-none pt-3"
        placeholder="Type your question or command here..."
        onChange={handleChange}
        value={inputText}
        style={{ fontFamily: "Monaco, monospace" }}
      ></textarea> */}
      <TextareaAutosize
        minRows={5}
        // maxRows={40}
        className="flex-grow resize-none overflow-auto rounded-none border-0 p-6 pt-3 shadow-none !outline-none focus:outline-none"
        placeholder="Type your question or command here..."
        onChange={handleChange}
        value={inputText}
        style={{ fontFamily: "Monaco, monospace" }}
      />

      <div className="flex justify-end space-x-2 p-4">
        <Button variant="ghost" onClick={addModel}>
          <span className="flex items-center text-gray-500">
            <PlusIcon className="mr-2 h-3 w-4" />
            Add Model
          </span>
        </Button>
        <Button variant="ghost" className="mr-12">
          Clear
        </Button>
        <Button variant="default" onClick={handleRunClick}>
          Run
        </Button>
        <Button variant="default" onClick={handleRunAllClick}>
          Run With Context
        </Button>
        <Button variant="default" onClick={handleRunImprovedClick}>
          Run Improved
        </Button>
      </div>
    </div>
  )
}

type ModelType = {
  name: string
  id: string
  provider: string
  description: string
  settings: {
    temperature: number
    topP: number
  }
  result: string
  modelChoices: {
    name: string
    provider: string
    description: string
    defaultSettings: {
      temperature: number
      topP: number
    }
  }[]
}

const Play = () => {
  const [models, setModels] = useState<ModelType[]>([
    {
      name: "gpt-4",
      id: "1234",
      provider: "openai",
      description: "OpenAI's third-generation language prediction model.",
      settings: { temperature: 0.7, topP: 1 },
      result: "",
      modelChoices: [
        {
          name: "gpt-4",
          provider: "openai",
          description: "OpenAI's third-generation language prediction model.",
          defaultSettings: { temperature: 0.7, topP: 1 },
        },
        {
          name: "gpt-3.5-turbo",
          provider: "openai",
          description: "OpenAI's second-generation language prediction model.",
          defaultSettings: { temperature: 0.6, topP: 0.9 },
        },
      ],
    },
    {
      name: "gpt-4",
      id: "5678",
      provider: "openai",
      description: "OpenAI's fourth-generation language prediction model.",
      settings: { temperature: 0.8, topP: 1 },
      result: "",
      modelChoices: [
        {
          name: "gpt-4",
          provider: "openai",
          description: "OpenAI's fourth-generation language prediction model.",
          defaultSettings: { temperature: 0.8, topP: 1 },
        },
        {
          name: "gpt-3.5-turbo",
          provider: "openai",
          description: "OpenAI's third-generation language prediction model.",
          defaultSettings: { temperature: 0.7, topP: 1 },
        },
      ],
    },
    // More models...
  ])
  const [inputText, setInputText] = useState<string>("this is a test")
  // const [footerPosition, setFooterPosition] = useState<string>("bottom")

  // const handleFooterPositionChange = (position: string) => {
  //   setFooterPosition(position)
  // }

  const clearModels = () => {
    setModels((prevModels: ModelType[]) =>
      prevModels.map((prevModel: ModelType) => ({ ...prevModel, result: "" }))
    )
  }
// }

const fetchModelResults = async (model: ModelType, inputText: string) => {
  // Create a Config object
  const config: Config = {
    type: model.provider,
    model: model.name,
  };

  // Create a Query object
  const query: Query = {
    query: inputText,
    llmConfig: config,
  };

  console.log("query: ", query);
  
  // Make the API request
  const response = await fetch("/api/inferenceFinal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  if (!response.ok) throw new Error(response.statusText);
  if (!response.body) throw new Error('Response body is missing');

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunkValue = decoder.decode(value, {stream: !done});

    setModels((prevModels: ModelType[]) => {
      return prevModels.map((prevModel: ModelType) => {
        if (prevModel.id === model.id) {
          return { ...prevModel, result: prevModel.result ? prevModel.result + chunkValue : chunkValue };
        }
        return prevModel;
      });
    });
  }
};

  const handleRunAll = async (inputText: string): Promise<void> => {
    clearModels()
    models.forEach(async (model: ModelType) => {
      let concatinatedPreviousResultsAndInputText = "Previous results:\n";
      models.forEach((model: ModelType) => {
        concatinatedPreviousResultsAndInputText += JSON.stringify({model: model.name, result: model.result}, null, 2) + '\n\n';
      });
      // let concatinatedPreviousResultsAndInputText = "Previous results:" + '\n\n' + JSON.stringify(models, null, 2);
      concatinatedPreviousResultsAndInputText += '\n\n\`\`\`\n' + "Based on the previous results, answer the following command:" + '\n\n' + inputText;

      console.log("concatinatedPreviousResultsAndInputText: ", concatinatedPreviousResultsAndInputText);

      await fetchModelResults(model, concatinatedPreviousResultsAndInputText)
    })
  }

  const handleRun = async (inputText: string): Promise<void> => {
    clearModels()
   
    models.forEach(async (model: ModelType) => {
      await fetchModelResults(model, inputText)
    }
    )
  }

  // const handeRunImproved = async (inputText: string): Promise<void> => {
  //   clearModels()

  //   const improvedInputText = await fetch("/api/improve", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ "query": inputText }),
  //   })

  //   if (!improvedInputText.ok) throw new Error(improvedInputText.statusText);

  //   const improvedInputTextJson = await improvedInputText.json();

  //   models.forEach(async (model: ModelType) => {
  //     await fetchModelResults(model, improvedInputTextJson.query)
  //   }
  //   )
  // }

  const handeRunImproved = async (inputText: string): Promise<void> => {
    clearModels();
  
    const response = await fetch("/api/improve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "query": inputText }),
    });

    console.log("response improved: ", response);
  
    if (!response.ok) throw new Error(response.statusText);
  
    const { query } = await response.json();
    
  
    for (const model of models) {
      await fetchModelResults(model, query);
    }
  }
  



  const getGridColumns = (numModels: number): string => {
    if (numModels === 1) {
      //neomorphic glassmorphism background
      return "sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 sm:min-h-[600px] md:min-h-[800px] lg:min-h-[800px]"
    } else if (numModels === 2) {
      return "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:min-h-[600px] md:min-h-[800px] lg:min-h-[800px]"
    } else if (numModels <= 4) {
      return "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:min-h-[200px] md:min-h-[500px] lg:min-h-[500px]"
    } else if (numModels <= 6) {
      return "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:min-h-[200px] md:min-h-[500px] lg:min-h-[500px]"
    } else {
      return "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    }
  }

  const gridColumns = useMemo(
    () => getGridColumns(models.length),
    [models.length]
  )

  const addModel = () => {
    const randomId = uuidv4() // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
    const newModel = {
      name: "gpt-3.5-turbo",
      id: randomId,
      provider: "openai",
      description: "OpenAI's third-generation language prediction model.",
      settings: { temperature: 0.7, topP: 1 },
      result: "",
      modelChoices: [
        {
          name: "gpt-3.5-turbo",
          provider: "openai",
          description: "OpenAI's third-generation language prediction model.",
          defaultSettings: { temperature: 0.7, topP: 1 },
        },
        {
          name: "gpt-4",
          provider: "openai",
          description: "OpenAI's second-generation language prediction model.",
          defaultSettings: { temperature: 0.6, topP: 0.9 },
        },
        // More model choices...
      ],
    }
    setModels(models.concat(newModel))
  }

  //   const deleteModel = (modelIndex: number) => {
  //     setModels(models.filter((_, index) => index !== modelIndex));
  //   };
  const deleteModel = useCallback((modelIndex: number) => {
    setModels((models) => models.filter((_, index) => index !== modelIndex))
  }, [])

  return (
    <div className="flex h-screen flex-col">
      {/* <Header /> */}
      <main
        className="flex-grow p-4"
        style={{
          backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px), radial-gradient(circle, #ccc 1px, transparent 1px)`,
          backgroundSize: `20px 20px` /* size of the grid */,
          backgroundPosition: `0 0, 10px 10px` /* position of the grid */,
        }}
      >
        <div className="mb-8">
          <Footer
            onRun={handleRun}
            onRunAll={handleRunAll}
            onRunImproved={handeRunImproved}
            inputText={inputText}
            setInputText={setInputText}
            addModel={addModel}
          />
        </div>
        <div className={`grid gap-4 ${gridColumns}`}>
          {models.map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              onDelete={() => deleteModel(index)}
              modelName={model.name}
              modelInference={model.result}
            />
          ))}
          <div
            className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed p-4"
            onClick={addModel}
          >
            <div
              className="hover:bg-gray-b flex cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-gray-300 bg-white p-4 text-base transition-all duration-300 ease-in-out"
              onClick={addModel}
            >
              <PlusIcon className="mr-2 h-6 w-6 text-gray-500" />
              <span className="font-semibold text-gray-700">Add Model</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Play
