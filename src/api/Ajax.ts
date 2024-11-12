'use strict';

interface RequestParams {
    url: string;
    body?: object;
    method: string;
}


class Ajax {
    static get(url: string): Promise<any> {
        return this.#makeRequest({
            method: 'GET',
            url: url,
        });
    }

    static async #makeRequest({
        method,
        url,
        body = {},
    }: RequestParams): Promise<any> {
        let request: Request;
        if (method === 'GET') {
            request = new Request(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
        } else {
            request = new Request(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });
        }
        return await fetch(request);
    }
}

export default Ajax;