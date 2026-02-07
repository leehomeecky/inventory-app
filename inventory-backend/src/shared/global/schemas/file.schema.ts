import { z } from 'zod';

export function fileSchema(
  data: {
    maxFileSize?: number;
    acceptedMimetype?: string[];
  },
  ...fileData: Express.Multer.File[]
) {
  const { acceptedMimetype, maxFileSize } = data;

  const fileSizeSchema = z.number().refine((size) => size <= maxFileSize, {
    message: `must not be larger than ${maxFileSize} bytes`,
  });

  const fileValidation = z.object({
    mimetype: z
      .string()
      .refine((mimeType) => acceptedMimetype.includes(mimeType), {
        message: `File must be one of [${acceptedMimetype.join(', ')}]`,
      }),
    size: fileSizeSchema,
  });

  fileData.forEach((file) =>
    z
      .object({
        [file.fieldname]: fileValidation,
      })
      .parse({ [file.fieldname]: file }),
  );
}
