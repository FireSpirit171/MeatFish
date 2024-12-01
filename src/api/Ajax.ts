'use strict';

import { getCookie } from "./Utils";

interface RequestParams {
    url: string;
    body?: object;
    method: string;
}

interface PostParams {
    url: string;
    body: object;
}

class Ajax {
    static get(url: string): Promise<any> {
        return this.#makeRequest({
            method: 'GET',
            url: url,
        });
    }

    static post({ url, body }: PostParams) {
        return this.#makeRequest({ method: 'POST', url, body });
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
            const csrfToken = getCookie('csrftoken');
            if (!csrfToken) {
                throw new Error('CSRF token is missing');
            }
            request = new Request(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'XCSRF-Token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });
        }
        return await fetch(request);
    }
}

export default Ajax;