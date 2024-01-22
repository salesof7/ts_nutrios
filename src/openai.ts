import { OpenAI } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();

export const model = new OpenAI({
  temperature: 0.6,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const prompt = new PromptTemplate({
  inputVariables: [
    "age",
    "gender",
    "weight",
    "height",
    "veg_or_nonveg",
    "disease",
    "region",
    "allergics",
    "foodtype",
  ],
  template:
    "Sistema de recomendação de dieta:\n" +
    "Quero que você recomende 6 nomes de café da manhã, 5 nomes de jantares e 6 nomes de exercícios, para uma pessoa com {disease}" +
    "com base nos seguintes critérios:\n" +
    "Idade: {age}\n" +
    "Sexo: {gender}\n" +
    "Peso: {weight}\n" +
    "Altura: {height}\n" +
    "Opção: {veg_or_nonveg}\n" +
    "Região: {region}\n" +
    "Alergias: {allergics}.",
});

export const chain = new LLMChain({ llm: model, prompt });

interface CategoryData {
  [key: string]: string[];
}

export function transformStringToObject(inputString: string): CategoryData {
  const lines = inputString.split("\n");
  const data: CategoryData = {};

  let currentCategory = "";

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine === "") return;

    if (trimmedLine.endsWith(":")) {
      currentCategory = trimmedLine.slice(0, -1).toLowerCase();
      data[currentCategory] = [];
    } else if (currentCategory) {
      data[currentCategory].push(trimmedLine);
    }
  });

  return data;
}
