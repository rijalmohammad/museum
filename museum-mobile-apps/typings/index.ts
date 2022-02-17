export interface UserResponse {
    userId: number;
    firstName: string;
    surName: string;
    phonenumber: string;
    email: string;
}

export interface AvailableTicket {
    id: string;
    name: string;
    price: number;
    description: string;
}

type BookingStatus = 'NOT PAID' | 'PAID' | 'EXPIRED';

export interface BookingItem {
    id: number | string;
    totalPrice: number;
    description: string;
    bookingDate: string;
    bookingTime: string,
    status: BookingStatus,
    quantity: number,
    name: string;
}

export interface ArtworkDetail {
    id:string;
    name: string;
    artist: string;
    date: string;
    site: string;
    size: string;
    description: string;
    image: string;
    remark: string;
}

type PaymentMethodName = 'Credit Card' | 'Bank Transfer';

export interface PaymentMethod {
    "__v": number;
    "_id": string;
    "name": PaymentMethodName,
}
