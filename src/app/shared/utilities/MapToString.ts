export function mapToString(map: Map<string, string>): string{
    let res: string = '';
    for (const entry of map.entries()){
        res += `[<${entry[0]}><${entry[1]}>]`;
    }
    return res;
}