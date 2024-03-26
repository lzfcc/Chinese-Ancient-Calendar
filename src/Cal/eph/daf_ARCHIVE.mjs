import fs from 'fs'
import { promisify } from 'util'
const openAsync = promisify(fs.open);
const readAsync = promisify(fs.read);
const writeAsync = promisify(fs.write);
const closeAsync = promisify(fs.close);

class DAF {
    constructor(filePath) {
        this.filePath = filePath;
        this.fd = null;
    }

    async open() {
        this.fd = await openAsync(this.filePath, 'r+');
    }

    async readRecord(n) {
        const buffer = Buffer.alloc(1024);
        await readAsync(this.fd, buffer, 0, 1024, (n - 1) * 1024);
        return buffer;
    }

    async writeRecord(n, data) {
        const buffer = Buffer.from(data);
        await writeAsync(this.fd, buffer, 0, buffer.length, (n - 1) * 1024);
    }

    async close() {
        await closeAsync(this.fd);
    }


}

// Usage example
(async () => {
    const daf = new DAF('path/to/your/file.daf');
    await daf.open();
    const record = await daf.readRecord(1);
    console.log(record);
    await daf.close();
})();