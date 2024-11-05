"use strict";

interface RegisterParams {
    username: string;
    password: string;
}

interface LoginParams {
    username: string;
    password: string;
}


import Ajax from "./Ajax.ts";

const APIClient = {
    BASE_URL: `http://${window.location.hostname}:8000`,

    async login({ username, password }: LoginParams) {
        const url = this.BASE_URL + "/login/";
        const body = {
            username: username,
            password: password,
        };
        return Ajax.post({ url, body });
    },

    // async logout() {
    //     const url = this.BASE_URL + "/users/deauthorization/";
    //     const body = {};
    //     return Ajax.post({ url, body });
    // },

    async register({ username, password }: RegisterParams) {
        const url = this.BASE_URL + "/users/auth/";
        const body = {
            username: username,
            password: password,
        };

        return Ajax.post({ url, body });
    },

    async getDishes(postfix: string){
        let url = this.BASE_URL + "/dishes/";
        if (postfix) {
            url += postfix;
        }
        console.log(url)
        return Ajax.get(url);
    }
};

export default APIClient;