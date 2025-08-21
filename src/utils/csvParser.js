const csv = require('csv-parser');

const praseCSV = (stream, onRow , onFinish ) => {
    let count = 0;
    stream
        .pipe(csv())
        .on('data', (row) => {
            count++;
            onRow(row, count);
        })
        .on('end', () => {
            onFinish(count);
        });

    
        
}

module.exports = { parseCSV };