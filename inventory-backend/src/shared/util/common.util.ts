export const acceptFileTypes = (mimeTypes: Array<string>) => (_, file, cb) => {
  cb(null, mimeTypes.includes(file.mimetype));
};
