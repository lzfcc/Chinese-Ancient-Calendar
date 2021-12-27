const HexoList = ['坤䷁', '剝䷖', '比䷇', '觀䷓', '豫䷏', '晉䷢', '萃䷬', '否䷋', '謙䷎', '艮䷳', '蹇䷦', '漸䷴', '小過䷽', '旅䷷', '咸䷞', '遯䷠', '師䷆', '蒙䷃', '坎䷜', '渙䷺', '解䷧', '未濟䷿', '困䷮', '訟䷅', '升䷭', '蠱䷑', '井䷯', '巽䷸', '恆䷟', '鼎䷱', '大過䷛', '姤䷫', '復䷗', '頤䷚', '屯䷂', '益䷩', '震䷲', '噬嗑䷔', '隨䷐', '无妄䷘', '明夷䷣', '賁䷕', '旣濟䷾', '家人䷤', '豐䷶', '離䷝', '革䷰', '同人䷌', '臨䷒', '損䷨', '節䷻', '中孚䷼', '歸妹䷵', '睽䷥', '兌䷹', '履䷺', '泰䷊', '大畜䷙', '需䷄', '小畜䷈', '大壯䷡', '大有䷍', '夬䷪', '乾䷀']

// [n,m] 范围内的随机整数
const Random = (n, m) => Math.floor(Math.random() * (m - n + 1)) + n
const Num = '初二三四五六'
export const DayanHexo = () => {
    const test = []
    const result = []
    const isYangRaw = []
    const Range = 5
    for (let i = 0; i < 6; i++) {
        let all = 48 // 一般應該是49
        test[i] = []
        for (let k = 0; k < 3; k++) {
            let a = Random(Range, all - Range)
            const l = a - 1
            const r = all - a
            const modL = l % 4 || 4 // 0=4
            const modR = r % 4 || 4
            test[i][k] = modL + modR + 1
            all -= test[i][k]
        }
        result[i] = all / 4
        if (result[i] % 2 === 1) {
            isYangRaw[i] = 1
        } else {
            isYangRaw[i] = 0
        }
    }
    let isYang = isYangRaw.slice()
    for (let i = 0; i < 6; i++) {
        if (result[i] === 6) {
            isYang[i] = 1
        }
        if (result[i] === 9) {
            isYang[i] = 0
        }
    }
    // 生成二進制數
    let BinaryStringRaw = ''
    for (let i = 0; i < 6; i++) {  // 上八卦表是從上到下開始二進制，所以要顛倒一下
        BinaryStringRaw += isYangRaw[i]
    }
    const BinaryRaw = parseInt(BinaryStringRaw, 2)
    const HexoAllRaw = HexoList[BinaryRaw]
    const NameRaw = HexoAllRaw.slice(0, HexoAllRaw.length - 1)
    const GraphRaw = HexoAllRaw.slice(-1)

    let BinaryString = ''
    for (let i = 0; i < 6; i++) {
        BinaryString += isYang[i]
    }
    const Binary = parseInt(BinaryString, 2)
    const HexoAll = HexoList[Binary]
    const Name = HexoAll.slice(0, HexoAll.length - 1)
    const Graph = HexoAll.slice(-1)
    // 接下來生成輸出
    const Print1 = []
    for (let i = 0; i < 6; i++) {
        Print1[i] = {
            title: Num[i],
            data: [...test[i], result[i], isYangRaw[i], isYang[i]]
        }
    }
    const Print2 = `<div style="margin:1.5em 0 1em">${Name}</div>`
    const Print3 = `<div style="font-size:4em;margin-left:-.12em">${Graph}</div>`
    const Print2Raw = `<div style="margin:1.5em 0 1em">${NameRaw}</div>`
    const Print3Raw = `<div style="font-size:4em;margin-left:-.12em">${GraphRaw}</div>`
    Print1[6] = {
        title: '',
        data: ['', '', '', '', Print2Raw, Print2]
    }
    Print1[7] = {
        title: '',
        data: ['', '', '', '', Print3Raw, Print3]
    }
    return Print1
}
// console.log(DayanHexo())

const TestSub = () => {
    let all = 48
    const n = 17
    for (let k = 0; k < 3; k++) {
        let a = Random(n, all - n)
        const l = a - 1
        const r = all - a
        const modL = l % 4 || 4 // 0=4
        const modR = r % 4 || 4
        all -= modL + modR + 1
    }
    return all / 4
}

const Test = () => {
    let Num6 = [], Num7 = [], Num8 = [], Num9 = [] //, Num0 = []
    for (let i = 1; i <= 3; i++) {
        Num6[i] = 0
        Num7[i] = 0
        Num8[i] = 0
        Num9[i] = 0
        // Num0[i] = 0
        for (let k = 0; k <= 100000000; k++) {
            const a = TestSub()
            if (a === 6) {
                Num6[i] += 1
            } else if (a === 7) {
                Num7[i] += 1
            } else if (a === 8) {
                Num8[i] += 1
            } else if (a === 9) {
                Num9[i] += 1
            } 
            // else {
            //     Num0[i] += 1
            // }
        }
    }
    const A6 = (Num6[1] + Num6[2] + Num6[3]) / 3
    const A7 = (Num7[1] + Num7[2] + Num7[3]) / 3
    const A8 = (Num8[1] + Num8[2] + Num8[3]) / 3
    const A9 = (Num9[1] + Num9[2] + Num9[3]) / 3
    return '6:' + Num6 + ',' + A6 + '. 7:' + Num7 + ',' + A7 + '. 8:' + Num8 + ',' + A8 + '. 9:' + Num9 + ',' + A9 // + '. 0:' + Num0
}

console.log(Test())