export interface OrderModel {
    readonly orderId: string;
    readonly userId: string;
    readonly status: string;
    readonly total: number;
    readonly tripsNames: string[];
    readonly tripsReserved: string[];
    readonly tripsIds: string[];
    readonly date: string;
}
