"use strict";

import Ajax from "./Ajax";

const APIClient = {
    BASE_URL: `http://${window.location.hostname}:3000/api/`,

    async getDishes(postfix: string) {
        let url = this.BASE_URL + "dishes/";
        if (postfix !== '') {
            url += postfix;
        }
        console.log(url);
        return Ajax.get(url);
    },

    async getDish(id: string) {
        const url = this.BASE_URL + `dishes/${id}/`;
        console.log(url);
        return Ajax.get(url);
    }
};

export default APIClient;
