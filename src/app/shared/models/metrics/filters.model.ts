
export class Filters {

    constructor (public values: Map<string, string> = new Map(), public isQuery: boolean = false) { }

    add(label: string, value: string) {
        this.values.set(label, value);
    }

    delete(label: string) {
        this.values.delete(label);
    }

    toJSON(): any {
        const mapObject: any = {};
        for (let entry of this.values.entries()){
            mapObject[entry[0]] = entry[1];
        }
        return { 'values': mapObject, 'isQuery': this.isQuery};
    }

}