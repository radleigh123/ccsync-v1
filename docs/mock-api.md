## Developing w/out Laravel

Add the following to your `.env` file:
```env
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8000/api
```

**Use the script `dev-mock` (not `npm run dev` or `npm start`) to run the app with mock API**
```bash
npm run dev-mock
```

> Note: Don't forget to do `npm install` to install the new dependency.

### Key Files
```
src/js/utils/mock/
├── data.js           # Initial/seed data for mock API
└── mockStorage.js    # Core mock API functions & localStorage management
```

---

### Initial Data (`data.js`)

The `data.js` file contains **seed data** that initializes the mock API. Think of it as your "database migrations" for the frontend.

#### User Data
```javascript
export const user = {
    message: "User retrieved successfully",
    user: {
        id: 1,
        name: "John",
        email: "john.doe@example.com",
        firebase_uid: "firebase-uid-123",
        id_school_number: 20200939,
        role: "admin"  // admin, user, guest
    }
};
```

**Use Case**: Represents the currently logged-in user. Used for testing authentication states and role-based UI.

#### Members Data
```javascript
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
            program: "BSCS",  // BSCS, BSIT, BSBA, BSA, etc.
            year: 4,          // 1, 2, 3, 4
            isPaid: true      // Membership payment status
        }
        // ... more members
    ]
};
```

**Use Case**: Organization members list. Used for testing member management features, list views, search/filter functionality.

#### Events Data
```javascript
export const events = {
    message: "Events retrieved successfully",
    events: [
        {
            id: 1,
            name: "Orientation Day",
            description: "Welcome to all new members!",
            venue: "Main Hall",
            event_date: "2023-09-01",
            time_from: "09:00",
            time_to: "12:00",
            registration_start: "2023-08-01",
            registration_end: "2023-08-25",
            max_participants: 100,
            status: "open"  // open, closed, cancelled
        }
        // ... more events
    ]
};
```

**Use Case**: Organization events/activities. Used for testing event management, registration flows, and calendar views.

---

### Usage in Components

#### Example: Fetching Members

```javascript
import { getMembers } from '/js/utils/mock/mockStorage.js';

function MembersList() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // In production, this would be an API call
        // For now, use mock data
        const response = getMembers();
        setMembers(response.members);
    }, []);

    return (
        <div>
            {members.map(member => (
                <div key={member.id}>{member.first_name} {member.last_name}</div>
            ))}
        </div>
    );
}
```

#### Example: Adding a Member with Form

```javascript
import { addMember } from '/js/utils/mock/mockStorage.js';

function AddMemberForm() {
    const handleSubmit = (formData) => {
        try {
            const response = addMember(formData);
            console.log('Member added:', response.member);
            // Show success message, redirect, etc.
        } catch (error) {
            console.error('Failed to add member:', error);
            // Show error message
        }
    };

    // ... form JSX
}
```

#### Example: Updating Member Status

```javascript
import { updateMember } from '/js/utils/mock/mockStorage.js';

function togglePaymentStatus(memberId, currentStatus) {
    try {
        const response = updateMember(memberId, {
            isPaid: !currentStatus
        });
        console.log('Payment status updated:', response.member);
        // Update UI
    } catch (error) {
        console.error('Failed to update member:', error);
    }
}
```

## Switching Between Mock and Real API
Set in `env` file:
```env
# Change value to 'production' for real API
NODE_ENV=development 
```