<div>
    Print += `
    <p>{data.YearInfo}</p>
    <table>
        <tr>
            <th>月</th>
            {(MonthPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>`
if (NewmSCPrint.length != 0) {
            Print += `
<tr>
        <th>定朔</th>
    {(NewmSCPrint || []).map((x) => (
        <td>{x}</td>
    ))}
</tr>
    <tr>
        <th>日期</th> 
{(NewmMmddPrint|| []).map((x) => (
    <td>{x}</td>
))}
</tr>`
        }
if (NewmDecimal3Print.length != 0) {
            Print += `
                <tr>
                <th>三次</th>
                {(NewmDecimal3Print || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>`
        }
if (NewmDecimal2Print.length != 0) {
            Print += `
                <tr>
                <th>二次</th>
                {(NewmDecimal2Print || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>`
        }
if (NewmDecimal1Print.length != 0) {
            Print += `
         <tr>
                <th>一次</th>
                {(NewmDecimal1Print || []).map((x) => (
                    <td>{x}</td>
                ))}
            </tr>
        }
        <tr>
            <th>平朔</th>
            {(NewmAvgSCPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>
        <th>分</th>
        {(NewmAvgDecimalPrint || []).map((x) => (
            <td>{x}</td>
        ))}
</tr>`
        }else {
            Print += `
    <tr>
<th>平朔</th>
    {( NewmAvgSCPrint || []).map((x) => (
        <td>{x}</td>
    ))}
</tr>
    <tr>
    <th>日期</th> 
{(NewmMmddPrint|| []).map((x) => (
<td>{x}</td>
))}
</tr>
<tr>
<th>分</th> 
    {(NewmAvgDecimalPrint|| []).map((x) => (
        <td>{x}</td>
    ))}
</tr>`
        }
        Print += `
    <tr>
            <th>望</th>
            {(SyzygySCPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>
        <tr>
            <th>分</th>
            {(SyzygyDecimalPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>
        <tr>
            <th>中氣</th>
            {(TermNamePrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>`
if (TermAcrSCPrint.length != 0) {
            Print += `
    <tr>
    <th>定氣</th>
{(TermAcrSCPrint|| []).map((x) => (
<td>{x}</td>
))}
</tr>
<tr>
<th>分</th>
    {( TermAcrDecimalPrint|| []).map((x) => (
        <td>{x}</td>
    ))}
</tr>`
        }
    Print += `
    <tr>
            <th>平氣</th>
            {(TermSCPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>
        <tr>
            <th>分</th>
            {(TermDecimalPrint || []).map((x) => (
                <td>{x}</td>
            ))}
        </tr>
    </table >`
</div >