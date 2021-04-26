import piexif from "piexifjs";
import jo from "jpeg-autorotate";
import dataUriToBuffer from "data-uri-to-buffer";
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
    "age-appearance": TConcept[];
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
  "age-appearance": "36f90889189ad96c516d134bc713004d",
};

const getDemographics = async (uri: string, resetOrientation: boolean) => {
  let data!: Buffer | string;

  if (resetOrientation) {
    data = await fixExifOrientation(uri);
  } else {
    data = uri.split(",")[1];
  }

  // const data = orientedImg.buffer;
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
          result.data = editDemographics(response);
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

const editDemographics = (response: any) => {
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
  return concept.value >= 0.01 && idx <= 4;
};

const manageRegions = (regions: any) => {
  return regions.data.concepts
    .filter(filterConcepts)
    .map(({ id, name, value }: any) => {
      if (name === "more than 70") {
        name = "70+";
      }

      return {
        id,
        name: name.replace("_", " "),
        value,
      };
    });
};

const fixExifOrientation = async (uri: string) => {
  const deleteThumbnailFromExif = (imageBuffer: Buffer) => {
    const imageString = imageBuffer.toString("binary");
    const exifObj = piexif.load(imageString);

    delete exifObj["thumbnail"];
    delete exifObj["1st"];

    const exifBytes = piexif.dump(exifObj);

    return Buffer.from(piexif.insert(exifBytes, imageString), "binary");
  };

  const buffer = deleteThumbnailFromExif(dataUriToBuffer(uri));

  try {
    const orientedImg = await jo.rotate(buffer, {});

    return orientedImg.buffer;
  } catch (err) {
    // code: 'no_orientation',
    // message: 'No orientation tag found in EXIF'
    // therefore it's okay to feed unRotated buffer back since this image didn't need to be oriented
    return buffer;
  }
};

const handler: NextApiHandler = async (req, res) => {
  const { imageBase64, resetOrientation } = req.body;

  try {
    const result = await getDemographics(imageBase64, resetOrientation);
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
