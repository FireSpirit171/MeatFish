"use strict";

import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getCookie } from "./Utils";

interface LoginParams {
    email: string;
    password: string;
}

interface APIResponse<T> {
    json: () => Promise<T>;
    ok: boolean;
    status: number;
    statusText: string;
}

class APIClient {
    private static instance: AxiosInstance;

    private static getInstance(): AxiosInstance {
        if (!this.instance) {
            this.instance = axios.create({
                baseURL: "http://localhost:3000/api/",
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            this.instance.interceptors.request.use(
                (config) => {
                    if (["post", "put", "delete"].includes(config.method || "")) {
                        const csrfToken = getCookie("csrftoken");
                        if (!csrfToken) {
                            throw new Error("CSRF token is missing");
                        }
                        config.headers["X-CSRFToken"] = csrfToken;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            this.instance.interceptors.response.use(
                (response) => response,
                (error) => {
                    console.error("[API Error]:", error.response?.data || error.message);
                    return Promise.reject(error);
                }
            );
        }
        return this.instance;
    }

    private static handleResponse<T>(response: AxiosResponse<T>): APIResponse<T> {
        return {
            json: async () => response.data,
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText,
        };
    }

    private static async safeRequest<T>(promise: Promise<AxiosResponse<T>>): Promise<APIResponse<T>> {
        try {
            const response = await promise;
            return this.handleResponse(response);
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return this.handleResponse(error.response);
            }
            throw error; // Network or unexpected error
        }
    }

    static async getCsrfToken(): Promise<string | null> {
        try {
            const response = await this.getInstance().get<{ csrfToken: string }>("csrf/");
            return response.data.csrfToken;
        } catch (error) {
            console.error("Failed to fetch CSRF token:", error);
            return null;
        }
    }

    static async getSession() {
        return this.safeRequest<unknown>(this.getInstance().get("users/check/"));
    }

    static async getDishes(postfix: string) {
        const url = postfix ? `dishes/${postfix}` : "dishes/";
        return this.safeRequest<unknown>(this.getInstance().get(url));
    }

    static async getDish(id: string) {
        return this.safeRequest<unknown>(this.getInstance().get(`dishes/${id}/`));
    }

    static async login({ email, password }: LoginParams) {
        return this.safeRequest<unknown>(this.getInstance().post("login/", { email, password }));
    }

    static async logout() {
        return this.safeRequest<unknown>(this.getInstance().post("logout/", {}));
    }

    static async auth({ email, password }: LoginParams) {
        return this.safeRequest<unknown>(this.getInstance().post("users/auth/", { email, password }));
    }

    static async getDinners(filters?: { date_from?: string; date_to?: string; status?: string }) {
        const query = new URLSearchParams(filters).toString();
        return this.safeRequest<unknown>(this.getInstance().get(`dinners/?${query}`));
    }

    static async getDinnerById(id: number) {
        return this.safeRequest<unknown>(this.getInstance().get(`dinners/${id}/`));
    }

    static async addDishToDraft(id: number) {
        return this.safeRequest<unknown>(this.getInstance().post(`dishes/${id}/draft/`, {}));
    }

    static async changeAddFields(id: number, tableNumber?: number) {
        return this.safeRequest<unknown>(this.getInstance().put(`dinners/${id}/edit`, { table_number: tableNumber }));
    }

    static async changeDishFields(dinnerId: number, dishId: number, guest?: string, count?: number) {
        const body: Record<string, string | number | undefined> = {};
        if (guest) body.guest = guest;
        if (count) body.count = count;
        return this.safeRequest<unknown>(this.getInstance().put(`dinners/${dinnerId}/dishes/${dishId}/`, body));
    }

    static async deleteDishFromDraft(dinnerId: number, dishId: number) {
        return this.safeRequest<unknown>(this.getInstance().delete(`dinners/${dinnerId}/dishes/${dishId}/`));
    }

    static async formDinner(dinnerId: number) {
        return this.safeRequest<unknown>(this.getInstance().put(`dinners/${dinnerId}/form/`, { status: "f" }));
    }

    static async deleteDinner(dinnerId: number) {
        return this.safeRequest<unknown>(this.getInstance().delete(`dinners/${dinnerId}/`));
    }

    static async updateProfile(email?: string, password?: string) {
        const body: Record<string, string | undefined> = {};
        if (email) body.email = email;
        if (password) body.password = password;
        return this.safeRequest<unknown>(this.getInstance().put("users/profile/", body));
    }
}

export default APIClient;
