const csv = require('csv-parser');
const fs = require('fs');

function parseCSV(input, onRow, onEnd) {
    return new Promise((resolve, reject) => {
        let stream;

       
        if (input instanceof fs.ReadStream) {
            stream = input;
        } else {
           
            stream = fs.createReadStream(input);
        }

        let count = 0;
        stream
            .pipe(csv())
            .on('data', (row) => {
                count++;
                if (onRow) onRow(row, count);
            })
            .on('end', async () => {
                if (onEnd) await onEnd(count);
                resolve();
            })
            .on('error', reject);
    });
}

module.exports =  parseCSV ;
