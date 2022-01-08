import { AppMimeType, BufferedFile } from '@modules/minio-client/file.model';
import { promises } from 'fs';
import * as fs from 'fs';
import * as path from 'path';

// const DATA = './data/';

export const readFileRetBufedFile = async (
  filePath: string,
): Promise<BufferedFile> => {
  const originalname = path.basename(filePath);
  const mimetype = path.extname(originalname) as AppMimeType;
  const buffer = await promises.readFile(filePath);
  return {
    originalname,
    buffer,
    size: fs.statSync(filePath).size,
    mimetype,
    encoding: '',
    fieldname: filePath,
  };
};

export const utilCwdPath = (cwdPath: string) => {
  return path.join(process.cwd(), cwdPath);
};
