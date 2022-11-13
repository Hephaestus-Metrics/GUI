export class CustomQuery {

    constructor(tag: string, query: string) {
        this.tag = tag;
        this.query = query;
    }

    tag: string;
    query: string;

    toJSON(): any {
        const mapObject: any = {};
        mapObject["tag"] = this.tag;
        mapObject["queryString"] = this.query;
        return mapObject;
    }
}