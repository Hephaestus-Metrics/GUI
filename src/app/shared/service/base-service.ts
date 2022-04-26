import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

export class BaseService {
    private readonly backendUrl: string;

    constructor(public http: HttpClient) {
        this.backendUrl = environment.backendUrl;
    }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(this.backendUrl + url);
    }

    put<T>(url: string, body: any) {
        // todo KS
        this.http.put<any>(this.backendUrl + url, body)
            .subscribe({
                next: (data: any) => {
                    console.log(data);
                },
                error: (error: any) => {
                    console.log(error);
                }
            })
    }

}