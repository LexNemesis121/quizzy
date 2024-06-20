import { parseString } from 'xml2js';

const parseXmlToJson = (xmlData: string | Record<string, any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof xmlData === 'string') {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } else if (typeof xmlData === 'object') {
      // Directly return the object if it's already parsed
      resolve(xmlData);
    } else {
      reject(new Error('Invalid XML data type'));
    }
  });
}

export default parseXmlToJson;
