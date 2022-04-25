import {Injectable} from "@angular/core";

@Injectable()
export class DataProvider {

    private filters: Map<string, string> = new Map();

    private napis: string = "jakis pierwszy napis";

    constructor() {}

    setNapis(napis: string): void {
        this.napis = napis;
    }

    getNapis(): string {
        return this.napis;
    }

    getFilters(): Map<string, string> {
        return this.filters;
    }

    setFilters(filters: Map<string, string>): void {
        this.filters = filters;
    }
}