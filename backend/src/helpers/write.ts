import { promises } from 'fs';
import * as path from 'path';

const DATA = './data/';

export const writeFileRetpath = async (
  basename: string,
  data: Buffer | string,
) => {
  const filePath = path.join(process.cwd(), DATA, basename);
  await promises.writeFile(filePath, data);
  return filePath;
};

export const writeJson = async (data: any, key: string) => {
  await promises.writeFile(
    path.join(process.cwd(), `${key}.json`),
    JSON.stringify(data, null, 2),
    {},
  );
};
