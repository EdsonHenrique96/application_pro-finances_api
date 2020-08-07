import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

const loadCsv = async (filename: string): Promise<Array<string[]>> => {
  const csvParsed: Array<string[]> = [];

  const csvFilePath = path.resolve(__dirname, `../../tmp/${filename}`);

  const parseCsvStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const readCsvStream = fs.createReadStream(csvFilePath);

  const csvStream = readCsvStream.pipe(parseCsvStream);

  csvStream.on('data', line => {
    csvParsed.push(line);
  });

  await new Promise(resolve => {
    csvStream.on('end', () => {
      fs.unlink(csvFilePath, err => {
        if (err) {
          console.info(`could not delete csv file: ${filename}`);
        }

        resolve();
      });
    });
  });

  return csvParsed;
};

export default loadCsv;
