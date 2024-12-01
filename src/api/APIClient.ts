"use strict";

import Ajax from "./Ajax";
import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

const APIClient = {
    BASE_URL: `http://localhost:3000/api/`,

    async getCsrfToken() {
        try {
            const url = this.BASE_URL + 'csrf/';
            const response = await Ajax.get(url);
            const data = await response.json()
            return data.csrfToken
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
            return null;
        }
    },

    async getSession() {
        const url = this.BASE_URL + 'users/check/'
        return Ajax.get(url)
    },

    async getDishes(postfix: string) {
        let url = this.BASE_URL + "dishes/";
        if (postfix !== '') {
            url += postfix;
        }
        return Ajax.get(url);
    },

    async getDish(id: string) {
        const url = this.BASE_URL + `dishes/${id}/`;
        return Ajax.get(url);
    },

    async login({email, password}:LoginParams) {
        const url = this.BASE_URL + '/login/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    },

    async auth({email, password}:LoginParams) {
        const url = this.BASE_URL + '/users/auth/'
        const body = {
            email: email,
            password: password
        }
        return Ajax.post({url, body})
    }
};

export default APIClient;
