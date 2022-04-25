import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class DataProvider {

    private filteredOptions: Observable<string[]> | null = null;
    private napis: string = "jakis pierwszy napis";

    constructor() {}

    setNapis(napis: string): void {
        this.napis = napis;
    }

    getNapis(): string {
        return this.napis;
    }

    getFilteredOptions(): Observable<string[]> | null {
        return this.filteredOptions;
    }

    setFilteredOptions(filteredOptions: Observable<string[]> | null): void {
        this.filteredOptions = filteredOptions;
    }
}