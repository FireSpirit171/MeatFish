/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Dish {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 100
   */
  name: string;
  /**
   * Type
   * @minLength 1
   * @maxLength 25
   */
  type?: string | null;
  /**
   * Description
   * @minLength 1
   */
  description: string;
  /**
   * Price
   * @min -2147483648
   * @max 2147483647
   */
  price: number;
  /**
   * Weight
   * @min -2147483648
   * @max 2147483647
   */
  weight: number;
  /** Photo */
  photo?: string;
}

export interface DinnerDish {
  /** ID */
  id?: number;
  /** Dinner */
  dinner: number;
  dish?: Dish;
  /**
   * Guest
   * @minLength 1
   * @maxLength 100
   */
  guest: string;
  /**
   * Count
   * @min -2147483648
   * @max 2147483647
   */
  count: number;
}

export interface DishImage {
  /** Photo */
  photo?: string;
}

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  dinners = {
    /**
     * No description
     *
     * @tags dinners
     * @name DinnersList
     * @request GET:/dinners/
     * @secure
     */
    dinnersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersDishesUpdate
     * @request PUT:/dinners/{dinner_id}/dishes/{dish_id}/
     * @secure
     */
    dinnersDishesUpdate: (dinnerId: string, dishId: string, data: DinnerDish, params: RequestParams = {}) =>
      this.request<DinnerDish, any>({
        path: `/dinners/${dinnerId}/dishes/${dishId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersDishesDelete
     * @request DELETE:/dinners/{dinner_id}/dishes/{dish_id}/
     * @secure
     */
    dinnersDishesDelete: (dinnerId: string, dishId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${dinnerId}/dishes/${dishId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersRead
     * @request GET:/dinners/{id}/
     * @secure
     */
    dinnersRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersUpdate
     * @request PUT:/dinners/{id}/
     * @secure
     */
    dinnersUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersDelete
     * @request DELETE:/dinners/{id}/
     * @secure
     */
    dinnersDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersCompleteList
     * @request GET:/dinners/{id}/complete/
     * @secure
     */
    dinnersCompleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/complete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersCompleteUpdate
     * @request PUT:/dinners/{id}/complete/
     * @secure
     */
    dinnersCompleteUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/complete/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersCompleteDelete
     * @request DELETE:/dinners/{id}/complete/
     * @secure
     */
    dinnersCompleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/complete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersEditList
     * @request GET:/dinners/{id}/edit/
     * @secure
     */
    dinnersEditList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/edit/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersEditUpdate
     * @request PUT:/dinners/{id}/edit/
     * @secure
     */
    dinnersEditUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/edit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersEditDelete
     * @request DELETE:/dinners/{id}/edit/
     * @secure
     */
    dinnersEditDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/edit/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersFormList
     * @request GET:/dinners/{id}/form/
     * @secure
     */
    dinnersFormList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/form/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersFormUpdate
     * @request PUT:/dinners/{id}/form/
     * @secure
     */
    dinnersFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dinners
     * @name DinnersFormDelete
     * @request DELETE:/dinners/{id}/form/
     * @secure
     */
    dinnersFormDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dinners/${id}/form/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  dishes = {
    /**
     * No description
     *
     * @tags dishes
     * @name DishesList
     * @request GET:/dishes/
     * @secure
     */
    dishesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesCreate
     * @request POST:/dishes/
     * @secure
     */
    dishesCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesRead
     * @request GET:/dishes/{id}/
     * @secure
     */
    dishesRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesUpdate
     * @request PUT:/dishes/{id}/
     * @secure
     */
    dishesUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/${id}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesDelete
     * @request DELETE:/dishes/{id}/
     * @secure
     */
    dishesDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesDraftCreate
     * @request POST:/dishes/{id}/draft/
     * @secure
     */
    dishesDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/dishes/${id}/draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags dishes
     * @name DishesImageCreate
     * @request POST:/dishes/{id}/image/
     * @secure
     */
    dishesImageCreate: (id: string, data: DishImage, params: RequestParams = {}) =>
      this.request<DishImage, any>({
        path: `/dishes/${id}/image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersAuthCreate
     * @request POST:/users/auth/
     * @secure
     */
    usersAuthCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/auth/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCheckList
     * @request GET:/users/check/
     * @secure
     */
    usersCheckList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/check/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfile
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfile: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
