'use strict';

export interface Dish {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    weight: number;
    photo: string;
}

export interface Dinner {
    id: number;
    table_number: number;
    total_cost: number;
    status: string;
    created_at: string | null;
    formed_at: string | null;
    completed_at: string | null,
    creator: number;
    moderator: number;
    qr: string;
}