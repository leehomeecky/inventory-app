export const generateToken = (length: number): string => {
  const minArray = Array(length).fill(0);
  const maxArray = Array(length + 1).fill(0);
  minArray[0] = maxArray[0] = 1;
  const minVal = minArray.join('');
  const maxVal = maxArray.join('');
  return (Math.random() * (+maxVal - +minVal) + +minVal).toFixed(0);
};

export const generateRandomString = (data: {
  size: number;
  withSpecials?: boolean;
}): string => {
  const { size, withSpecials } = data;
  let result = '';
  let maxCount = size * 3;

  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  if (withSpecials) characters = characters.concat('*^%$&#@)(<>/?:-');

  const charactersLength = characters.length - 1;

  const getRandomChar = () =>
    characters.charAt(Math.floor(Math.random() * charactersLength));

  while (result.length < size && maxCount > 0) {
    --maxCount;
    result += getRandomChar();
  }

  return result;
};

export function recomposeMapObject({
  fromKeys,
  toKeys,
  data,
  isArray,
}: {
  fromKeys: Array<string>;
  toKeys: Array<string>;
  isArray?: boolean;
  data: Record<string, any> | Array<Record<string, any>>;
}) {
  let result;
  if (isArray) {
    result = data.map((val) => {
      const composedObject = {};
      fromKeys.forEach((key, index) => {
        composedObject[toKeys[index]] = val[key] || null;
      });
      return composedObject;
    });

    return result;
  }

  result = {};
  fromKeys.forEach((key, index) => {
    result[toKeys[index]] = data[key] || null;
  });

  return result;
}

export const acceptFileTypes = (mimeTypes: Array<string>) => (_, file, cb) => {
  cb(null, mimeTypes.includes(file.mimetype));
};

export async function generatePassword() {
  const randomString = await generateRandomString({
    size: 12,
    withSpecials: true,
  });
  const len = Math.floor(Math.random() * 5) + 1;
  const randomNum = await generateToken(len);
  return `M-${randomString.concat(randomNum)}`;
}

export function formatPhoneNumber(data: {
  countryCode: string;
  phoneNumber: string;
  action: 'ENCODE' | 'DECODE';
}) {
  const { action, countryCode, phoneNumber } = data;

  // Already handling decoding by default
  let result = /^\+/.test(phoneNumber)
    ? phoneNumber.slice(countryCode.length)
    : phoneNumber;

  // handling encoding
  if (action === 'ENCODE')
    result =
      countryCode +
      (/^0/.test(phoneNumber)
        ? phoneNumber.substring(1)
        : /^\+/.test(phoneNumber)
          ? phoneNumber.slice(countryCode.length)
          : phoneNumber);

  return result;
}
