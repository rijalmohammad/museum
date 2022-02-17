import { AvailableTicket, UserResponse } from "../typings";

export const userResponse: UserResponse = {
    userId: 12312312,
    firstName: "Yishak",
    surName: "Abreham",
    phoneNumber: "98989989898",
    email: "yishak@email.com"
}

export const availableTicketsResponse: AvailableTicket[] = [
    {
        id: "12312312",
        name: 'Ticket1',
        description: "This is ticket 1",
        price: 200,
    },
    {
        id: "123123s12",
        name: 'Ticket2',
        description: "This is ticket 2",
        price: 300,
    },
    {
        id: "1223123s12",
        name: 'Ticket3',
        description: "This is ticket 3",
        price: 300,
    }
];