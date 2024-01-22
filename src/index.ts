import express from "express";
import { chain, transformStringToObject } from "./openai";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/ia", async (req, res) => {
  try {
    const inputData = {
      age: req.body.age,
      gender: req.body.gender,
      weight: req.body.weight,
      height: req.body.height,
      veg_or_nonveg: req.body.veg_or_nonveg,
      disease: req.body.disease,
      region: req.body.region,
      allergics: req.body.allergics,
      foodtype: req.body.foodtype,
    };

    const result = (await chain.invoke(inputData)) as { text: string };

    const text = result.text as string;
    const data = transformStringToObject(text);
    res.json(data).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
