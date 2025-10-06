export const user = {
    message: "User retrieved successfully",
    user: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        email_verified_at: "2023-08-01",
        firebase_uid: "firebase-uid-123",
        id_school_number: 20200939,
        password: "hashed-password",
        role: "admin", // admin, user
        remember_token: null
    }
};

export const members = {
    message: "Members retrieved successfully",
    members: [
        {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            suffix: "Jr.",
            id_school_number: 20200937,
            email: "john.doe@example.com",
            birth_date: "2000-01-15",
            enrollment_date: "2020-08-15",
            program: "BSCS",
            year: 4,
            isPaid: true,
        },
        {
            id: 2,
            first_name: "Jane",
            last_name: "Smith",
            suffix: "Sr.",
            id_school_number: 20200938,
            email: "jane.smith@example.com",
            birth_date: "2000-02-20",
            enrollment_date: "2020-08-15",
            program: "BSIT",
            year: 4,
            isPaid: true,
        },
        {
            id: 3,
            first_name: "Alice",
            last_name: "Johnson",
            suffix: "Jr.",
            id_school_number: 20200939,
            email: "alice.johnson@example.com",
            birth_date: "2000-03-25",
            enrollment_date: "2020-08-15",
            program: "BSBA",
            year: 4,
            isPaid: true,
        },
        {
            id: 4,
            first_name: "Bob",
            last_name: "Brown",
            suffix: "Sr.",
            id_school_number: 20200940,
            email: "bob.brown@example.com",
            birth_date: "2000-04-30",
            enrollment_date: "2020-08-15",
            program: "BSA",
            year: 4, // 1, 2, 3, 4
            isPaid: true,
        }]
};

export const events = {
    message: "Events retrieved successfully",
    events: [
        {
            id: 1,
            name: "Oritentation Day",
            description: "Welcome to all new members!",
            venue: "Main Hall",
            event_date: "2023-09-01",
            time_from: "09:00",
            time_to: "12:00",
            registration_start: "2023-08-01",
            registration_end: "2023-08-25",
            max_participants: 100,
            status: "open", // open, closed, cancelled
        },
        {
            id: 2,
            name: "Tech Talk",
            description: "Latest trends in technology.",
            venue: "Room 101",
            event_date: "2023-09-15",
            time_from: "10:00",
            time_to: "11:30",
            registration_start: "2023-08-15",
            registration_end: "2023-09-10",
            max_participants: 50,
            status: "open", // open, closed, cancelled
        },
        {
            id: 3,
            name: "Workshop on AI",
            description: "Exploring the latest advancements in AI.",
            venue: "Room 102",
            event_date: "2023-09-22",
            time_from: "13:00",
            time_to: "15:00",
            registration_start: "2023-08-22",
            registration_end: "2023-09-20",
            max_participants: 30,
            status: "open", // open, closed, cancelled
        },
        {
            id: 4,
            name: "Annual General Meeting",
            description: "Discussing the annual performance and future plans.",
            venue: "Main Hall",
            event_date: "2023-09-30",
            time_from: "10:00",
            time_to: "12:00",
            registration_start: "2023-08-30",
            registration_end: "2023-09-28",
            max_participants: 200,
            status: "open", // open, closed, cancelled
        }
    ]
};

export const eventsRegistrations = {
    message: "Event registrations retrieved successfully",
    registrations: [
        {
            id: 1,
            event_id: 1,
            member_id: 1,
            registered_at: "2023-08-10"
        },
        {
            id: 2,
            event_id: 1,
            member_id: 2,
            registered_at: "2023-08-11"
        },
        {
            id: 3,
            event_id: 2,
            member_id: 1,
            registered_at: "2023-08-20"
        }
    ]
};

export const officers = {
    message: "Officers retrieved successfully",
    officers: [],
};

export const requirements = {
    message: "Requirements retrieved successfully",
    requirements: [],
};