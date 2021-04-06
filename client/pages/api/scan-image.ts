import { NextApiHandler } from "next";
import { metadata, stub } from "../../server/clarifai";

type TConcept = { id: string; name: string; value: number };
type TDataOutput = {
  id: string;
  bounding_box: {
    top_row: number;
    left_col: number;
    bottom_row: number;
    right_col: number;
  };
  concepts: {
    "multicultural-appearance": TConcept[];
    "gender-appearance": TConcept[];
    "age-appearence": TConcept[];
    [key: string]: TConcept[];
  };
};

type TDemographicsResult = {
  status: {
    code: number;
    message: string;
  };
  data: TDataOutput[];
};

const models = {
  "multicultural-appearance": "93c277ec3940fba661491fda4d3ccfa0",
  "gender-appearance": "af40a692dfe6040f23ca656f4e144fc2",
  "age-appearence": "36f90889189ad96c516d134bc713004d",
};

const getDemographics = (uri: string) => {
  const data = uri.split(",")[1];
  const inputs = [
    {
      data: {
        image: {
          base64: data,
        },
      },
    },
  ];

  return new Promise<TDemographicsResult>((resolve, reject) => {
    stub.PostWorkflowResults(
      {
        workflow_id: "Demographics",
        inputs,
      },
      metadata,
      (err: any, response: any) => {
        // err doesn't have value
        const result = {
          status: {
            // code: response.status.code,
            // message: response.status.description,
            code: response.status.code,
            message: response.status.description,
          },
        } as TDemographicsResult;

        if (
          response.status.code !== 10000 && // OK
          response.status.code !== 10010 // Mixed Success
        ) {
          resolve(result);
          return;
        }

        try {
          result.data = filterDemographics(response);
          resolve(result);
        } catch (err) {
          // maybe this isn't wise, since this internal error is related to my server but not clarifai's
          result.status.code = 99009;
          result.status.message = "Internal Error";
          resolve(result);
        }
      }
    );
  });
};

const filterDemographics = (response: any) => {
  const dataOutput: TDataOutput[] = [];
  let itemsAssigned = false;

  for (const key in models) {
    let data = {} as any;
    // @ts-ignore
    const id = models[key] as string;
    const output = response.results[0].outputs.find(
      ({ model }: any) => model.id === id
    );
    // console.log(output);
    if (!itemsAssigned) {
      output.data.regions.forEach((region: any) => {
        data = {
          id: region.id,
          bounding_box: region.region_info.bounding_box,
          concepts: {},
        };
        data.concepts[key] = manageRegions(region);

        dataOutput.push(data);
      });
    } else {
      dataOutput.forEach((data) => {
        const region = output.data.regions.find(
          (region: any) => region.id === data.id
        );
        data.concepts[key] = manageRegions(region);
      });
    }
    itemsAssigned = true;
  }

  return dataOutput;
};

const filterConcepts = (concept: TConcept, idx: number, self: TConcept[]) => {
  if (idx === 0) return true;
  return concept.value >= 0.03 && idx <= 3;
};

const manageRegions = (regions: any) => {
  return regions.data.concepts
    .filter(filterConcepts)
    .map(({ id, name, value }: any) => ({
      id,
      name,
      value,
    }));
};

const handler: NextApiHandler = async (req, res) => {
  const { imageBase64 } = req.body;

  try {
    console.log(req.url);
    const result = await getDemographics(imageBase64);
    res.send(result);
  } catch (err) {
    console.log("ERROR", err);
    res.send(err);
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "3.5mb", // Set max body size
    },
  },
};

export default handler;
