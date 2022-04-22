import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

export class BaseService {
    private readonly backendUrl: string;

    constructor(public http: HttpClient) {
        this.backendUrl = environment.backendUrl;
    }

    get<T>(url: string): Observable<T> {
        console.log(this.backendUrl + url);
        return this.http.get<T>(this.backendUrl + url);
    }
}