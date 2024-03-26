// 轉換自jplephem.spk 但是js處理異步操作很麻煩，放棄
// Assuming the presence of required polyfills or libraries for handling binary data,
// interpolations, and other operations.
import { rollAxis, matrix } from 'mathjs'
const T0 = 2451545;
const S_PER_DAY = 86400;
const divmod = (a, b) => { parseInt(a / b), a % b }


function rollAxis(mathMatrix, axis, start) {
    const size = mathMatrix.size(); // 获取矩阵的维度
    // 如果轴参数是负数，则将其转换为正数
    if (axis < 0) {
        axis += size.length;
    }
    if (start < 0) {
        start += size.length;
    }
    // 生成新的轴顺序
    let newAxes = [];
    for (let i = 0; i < size.length; i++) {
        if (i !== axis) {
            newAxes.push(i);
        }
    }
    newAxes.splice(start, 0, axis);
    // 根据新的轴顺序重新排列矩阵
    return rollAxis(mathMatrix, newAxes);
}
// 示例
// const originalMatrix = matrix([
//     [[1, 2], [3, 4]],
//     [[5, 6], [7, 8]]
// ]);
// const result = rollAxis(originalMatrix, 2, 0);
// console.log(result.toString());


function jd(seconds) {
    // Convert a number of seconds since J2000 to a Julian Date.
    return T0 + seconds / S_PER_DAY;
}
function titlecase(name) {
    // Converts a string to title case if it does not start with certain patterns
    const unsafePrefixes = ['1', 'C/', 'DSS-'];
    const isUnsafe = unsafePrefixes.some(prefix => name.startsWith(prefix));
    return isUnsafe ? name : name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

class SPK {
    // A JPL SPK ephemeris kernel for computing positions and velocities.
    constructor(daf) {
        this.daf = daf;
        this.segments = this.daf.summaries().map(([source, descriptor]) =>
            buildSegment(this.daf, source, descriptor)
        );
        this.pairs = {};
        for (const s of this.segments) {
            this.pairs[[s.center, s.target]] = s;
        }
    }

    static open(path) {
        // Open the file at `path` and return an SPK instance.
        // Note: File handling in Node.js would use the 'fs' module.
        const daf = new DAF(fs.readFileSync(path));
        return new SPK(daf);
    }

    close() {
        // Close this SPK file.
        // Note: File handling in Node.js would use the 'fs' module.
        this.daf.file.close();
        for (const segment of this.segments) {
            if ('_data' in segment) {
                delete segment._data;
            }
        }
        this.daf._array = null;
        this.daf._map = null;
    }

    toString() {
        // Return a string representation of the SPK object.
        const lines = [
            `File type ${this.daf.locidw} and format ${this.daf.locfmt} with ${this.segments.length} segments:`,
        ];
        lines.push(...this.segments.map(segment => segment.toString()));
        return lines.join('\n');
    }

    getItem(key) {
        // Given (center, target) integers, return the last matching segment.
        return this.pairs[key];
    }

    comments() {
        // Return the file comments, as a string.
        return this.daf.comments();
    }
    // enter() {
    //     return this
    // }
}
const segmentClasses = {
    2: Segment, // Assuming 'Segment' is defined somewhere
    3: Segment, // Assuming 'Segment' is defined somewhere
    9: Type9Segment // Assuming 'Type9Segment' is defined somewhere
};

function buildSegment(daf, source, descriptor) {
    const dataType = descriptor[5];
    const SegmentClass = segmentClasses[dataType] || BaseSegment;
    return new SegmentClass(daf, source, descriptor);
}

class BaseSegment {
    constructor(daf, source, descriptor) {
        this.daf = daf;
        this.source = source;
        [this.start_second, this.end_second, this.target, this.center,
        this.frame, this.data_type, this.start_i, this.end_i] = descriptor;
        this.start_jd = jd(this.start_second);
        this.end_jd = jd(this.end_second);
    }

    toString() {
        return this.describe(false);
    }

    describe(verbose = true) {
        // A helper function like titlecase() would be needed to convert a string to title case.
        const center = titlecase(targetNames.get(this.center) || 'Unknown center');
        const target = titlecase(targetNames.get(this.target) || 'Unknown target');
        let text = `${this.start_jd.toFixed(2)}..${this.end_jd.toFixed(2)}  Type ${this.data_type}  ${center} (${this.center}) -> ${target} (${this.target})`;
        if (verbose) {
            text += `\n  frame=${this.frame} source=${this.source.toString('ascii')}`;
        }
        return text;
    }

    compute(tdb, tdb2 = 0.0) {
        // Compute the component values for the time `tdb` plus `tdb2`.
        throw new Error(
            `jplephem has not yet learned how to compute positions from an ephemeris segment with data type ${this.data_type}`
        );
    }

    computeAndDifferentiate(tdb, tdb2 = 0.0) {
        // Compute components and differentials for time `tdb` plus `tdb2`.
        throw new Error(
            `jplephem has not yet learned how to compute positions and velocities from an ephemeris segment with data type ${this.data_type}`
        );
    }
}

class Segment extends BaseSegment {
    constructor(daf, source, descriptor) {
        super(daf, source, descriptor);
    }

    compute(tdb, tdb2 = 0.0) {
        // Compute the component values for the time `tdb` plus `tdb2`.
        // This is a simplified placeholder for the actual computation logic.
        let position = null; // Placeholder for computed position
        for (let position of this.generate(tdb, tdb2)) {
            return position;
        }
    }

    computeAndDifferentiate(tdb, tdb2 = 0.0) {
        // Compute components and differentials for time `tdb` plus `tdb2`.
        // This is a simplified placeholder for the actual computation logic.
        return [...this.generate(tdb, tdb2)];
    }

    get _data() {
        if (!this.__data) {
            if (this.data_type === 2) {
                this.component_count = 3;
            } else if (this.data_type === 3) {
                this.component_count = 6;
            } else {
                throw new Error('this class only supports SPK data types 2 and 3');
            }

            const [init, intlen, rsize, n] = this.daf.readArray(this.end_i - 3, this.end_i);
            const coefficient_count = (rsize - 2) / this.component_count;
            let coefficients = this.daf.mapArray(this.start_i, this.end_i - 4);

            coefficients = this.reshape(coefficients, n, rsize);
            coefficients = coefficients.map(row => row.slice(2)); // ignore MID and RADIUS elements
            coefficients = this.reshape(coefficients, n, this.component_count, coefficient_count);
            coefficients = this.rollAxis(coefficients, 1);
            coefficients = this.rollAxis(coefficients, 2);
            coefficients = coefficients.reverse();

            this.__data = [init, intlen, coefficients];
        }
        return this.__data;
    }

    loadArray() {
        const [init, intlen, coefficients] = this._data;
        const initialEpoch = jd(init);
        const intervalLength = intlen / S_PER_DAY;
        const transposedCoefficients = this.rollAxis(coefficients, 2);
        transposedCoefficients = this.rollAxis(transposedCoefficients, 2);
        return [initialEpoch, intervalLength, transposedCoefficients];
    }

    *generate(tdb, tdb2) {
        const scalar = !(tdb.shape) && !(tdb2.shape);
        if (scalar) tdb = [tdb];
        const [init, intlen, coefficients] = this._data;
        const [coefficient_count, component_count, n] = this.shape(coefficients)
        const index1 = tdb.map(x => parseInt(((x - T0) * S_PER_DAY - init) / intlen))
        const offset1 = tdb.map(x => ((x - T0) * S_PER_DAY - init) % intlen)
        const index2 = tdb2.map(x => parseInt(x * S_PER_DAY / intlen))
        const offset2 = tdb2.map(x => (x * S_PER_DAY) % intlen)
        const index3 = [], offset = [], index = []
        for (let i = 0; i < offset1.length; i++) {
            index3[i] = parseInt((offset1[i] + offset2[i]) / intlen)
            offset[i] = (offset1[i] + offset2[i]) % intlen
        }
        for (let i = 0; i < index1.length; i++) {
            index[i] = parseInt(index1[i] + index2[i] + index3[i])
        }
        if (index.some(i => i < 0 || i > n)) {
            throw new Error(`segment only covers dates ${this.start_jd} through ${this.end_jd}`);
        }
        const omegas = index.map(i => i === n);
        index = index.map((i, idx) => omegas[idx] ? i - 1 : i);
        offset = offset.map((o, idx) => omegas[idx] ? o + intlen : o);
        function selectLayers(coefficients, indices) {
            const selectedLayers = [];
            indices.forEach(index => {
                const layer = coefficients.map(twoDArray =>
                    twoDArray.map(row => row[index])
                );
                selectedLayers.push(layer);// 将选中的层添加到结果数组中
            });
            // 如果只选择了一个层，则直接返回该层，否则返回包含所有选中层的数组
            return selectedLayers.length === 1 ? selectedLayers[0] : selectedLayers;
        }
        let selectedCoefficients = selectLayers(coefficients, index); // coefficients = coefficients[:,:,index]

        const s = offset.map(o => 2.0 * o / intlen - 1.0);
        const s2 = s.map(x => 2.0 * x);
        let w0 = w1 = 0.0;
        let wlist = [];
        selectedCoefficients.slice(0, -1).forEach(coefficient => {
            let w2 = w1;
            w1 = w0;
            w0 = coefficient.map((c, idx) => c + s2[idx] * w1 - w2);
            wlist.push(w1);
        });

        let components = selectedCoefficients[selectedCoefficients.length - 1].map((c, idx) => c + s[idx] * w0[idx] - w1[idx]);

        if (scalar) {
            components = components[0];
        }

        yield components;

        let dw0 = dw1 = 0.0;
        selectedCoefficients.slice(0, -1).forEach((coefficient, index) => {
            let dw2 = dw1;
            dw1 = dw0;
            dw0 = 2.0 * wlist[index] + dw1 * s2[index] - dw2;
        });

        let rates = w0.map((w, idx) => w + s[idx] * dw0[idx] - dw1[idx]);
        rates = rates.map(rate => rate / intlen * 2.0 * S_PER_DAY);

        if (scalar) {
            rates = rates[0];
        }

        yield rates;
    }
}

// Helper functions for the Segment class
function isScalar(value) {
    // Determine if the input is a scalar (not an array or object)
    return !Array.isArray(value) && typeof value !== 'object';
}
