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
    },

    async getDinners(){
        const url = this.BASE_URL + 'dinners/';
        return Ajax.get(url);
    },

    async getDinnerById(id: number){
        const url = this.BASE_URL + `dinners/${id}/`
        return Ajax.get(url)
    },
    
    async addDishToDraft(id: number){
        const url = this.BASE_URL + `/dishes/${id}/draft/`;
        const body = {}
        return Ajax.post({url, body});
    },

    async changeAddFields(id:number, tableNumber?: number) {
        const url = this.BASE_URL + `dinners/${id}/edit`;
        const body = {
            table_number: tableNumber
        }

        return Ajax.put({url, body})
    },

    async changeDishFields(dinnerId: number, dishId: number, guest?: string, count?: number){
        const url = this.BASE_URL + `dinners/${dinnerId}/dishes/${dishId}/`;
        const body: any = {};
        if (guest) body.guest = guest;
        if (count) body.count = count;

        return Ajax.put({url, body})
    },

    async deleteDishFromDraft(dinnerId: number, dishId: number) {
        const url = this.BASE_URL + `dinners/${dinnerId}/dishes/${dishId}/`;
        const body = {}
        return Ajax.delete({url, body})
    },

    async formDinner(dinnerId: number) {
        const url = this.BASE_URL + `dinners/${dinnerId}/form/`;
        const body = {
            status: 'f'
        }
        return Ajax.put({url, body});
    },

    async deleteDinner(dinnerId: number) {
        const url = this.BASE_URL + `dinners/${dinnerId}/`;
        const body = {}
        return Ajax.delete({url, body});
    }
};

export default APIClient;