import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { Downloads } from './downloads.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class DownloadsService {

    private resourceUrl = SERVER_API_URL + 'api/downloads';

    constructor(private http: Http) { }

    create(downloads: Downloads): Observable<Downloads> {
        const copy = this.convert(downloads);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(downloads: Downloads): Observable<Downloads> {
        const copy = this.convert(downloads);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Downloads> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Downloads.
     */
    private convertItemFromServer(json: any): Downloads {
        const entity: Downloads = Object.assign(new Downloads(), json);
        return entity;
    }

    /**
     * Convert a Downloads to a JSON which can be sent to the server.
     */
    private convert(downloads: Downloads): Downloads {
        const copy: Downloads = Object.assign({}, downloads);
        return copy;
    }
}
