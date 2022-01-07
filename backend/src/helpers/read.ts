import { AppMimeType, BufferedFile } from '@modules/minio-client/file.model';
import { promises } from 'fs';
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
    size: 0,
    mimetype,
    encoding: '',
    fieldname: '',
  };
};
