"use strict";

import Ajax from "./Ajax.ts";

const APIClient = {
    BASE_URL: `http://192.168.190.224:8000/`,

    async getDishes(postfix: string){
        let url = this.BASE_URL + "dishes/";
        if (postfix !== '') {
            url += postfix;
        }
        console.log(url)
        return Ajax.get(url);
    },

    async getDish(id: string) {
        const url = this.BASE_URL + `dishes/${id}/`;
        console.log(url)
        return Ajax.get(url);
    }
};

export default APIClient;