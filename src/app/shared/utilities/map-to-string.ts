export function mapToString(map: Map<string, string>): string{
    let res: string = '';
    for (const entry of map.entries()){
        res += `\n {entry[0]} \n {entry[1]}`;
    }
    return res;
}