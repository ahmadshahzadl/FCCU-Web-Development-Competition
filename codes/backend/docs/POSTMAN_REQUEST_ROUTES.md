# Postman Testing Guide - Request Routes

## Base Configuration

**Base URL:** `http://localhost:3000/api/requests`

**Note:** All routes require authentication. You need to sign in first to get a JWT token.

---

## Step 1: Get Authentication Token

Before testing request routes, you need to authenticate:

**Endpoint:** `POST http://localhost:3000/api/auth/signin`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:** Copy the `token` from the response. You'll use it in the `Authorization` header for all request routes.

---

## Request Routes

### 1. Get Total Request Count

**Method:** `GET`  
**URL:** `http://localhost:3000/api/requests/count`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters (Optional):**
- `status` - Filter by status: `pending`, `in-progress`, `resolved`
- `category` - Filter by category: `maintenance`, `academic`, `lost-found`, `general`
- `studentId` - Filter by student ID

**Example URLs:**
```
http://localhost:3000/api/requests/count
http://localhost:3000/api/requests/count?status=pending
http://localhost:3000/api/requests/count?category=maintenance&status=pending
http://localhost:3000/api/requests/count?studentId=STU123
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 25
  }
}
```

---

### 2. Get All Requests (with Pagination)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/requests`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters (Optional):**
- `status` - Filter by status: `pending`, `in-progress`, `resolved`
- `category` - Filter by category: `maintenance`, `academic`, `lost-found`, `general`
- `studentId` - Filter by student ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example URLs:**
```
http://localhost:3000/api/requests
http://localhost:3000/api/requests?page=1&limit=20
http://localhost:3000/api/requests?status=pending&page=1&limit=10
http://localhost:3000/api/requests?category=academic&status=in-progress
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "category": "maintenance",
      "description": "AC not working in room 205",
      "status": "pending",
      "studentId": "STU123",
      "studentName": "John Doe",
      "createdBy": "johndoe",
      "createdAt": "2024-12-08T10:00:00.000Z",
      "updatedAt": "2024-12-08T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 3. Get Request by ID

**Method:** `GET`  
**URL:** `http://localhost:3000/api/requests/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Example URL:**
```
http://localhost:3000/api/requests/507f1f77bcf86cd799439011
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "maintenance",
    "description": "AC not working in room 205",
    "status": "pending",
    "studentId": "STU123",
    "studentName": "John Doe",
    "attachmentUrl": "/uploads/attachment-123.jpg",
    "adminNotes": null,
    "createdBy": "johndoe",
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T10:00:00.000Z"
  }
}
```

---

### 4. Create New Request

**Method:** `POST`  
**URL:** `http://localhost:3000/api/requests`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value | Required |
|-----|------|-------|----------|
| `category` | Text | `maintenance` | ✅ Yes |
| `description` | Text | `AC not working in room 205` | ✅ Yes |
| `attachment` | File | (Select file) | ❌ No (Optional) |

**Notes:**
- `studentId` and `studentName` are automatically taken from the authenticated user's JWT token. You don't need to provide them manually.
- `attachment` is completely optional. You can create requests without uploading any file.

**Valid Categories:**
- `maintenance`
- `academic`
- `lost-found`
- `general`

**Example Body (form-data) - With Attachment:**
```
category: maintenance
description: AC not working in room 205. Please fix ASAP.
attachment: [Select a file]
```

**Example Body (form-data) - Without Attachment:**
```
category: maintenance
description: AC not working in room 205. Please fix ASAP.
```

**Note:** The `studentId` and `studentName` will be automatically extracted from your authenticated user's token. The `attachment` field is optional - you can omit it entirely if you don't need to upload a file.

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "maintenance",
    "description": "AC not working in room 205. Please fix ASAP.",
    "status": "pending",
    "studentId": "STU123",
    "studentName": "John Doe",
    "attachmentUrl": "/uploads/attachment-123.jpg",
    "createdBy": "johndoe",
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T10:00:00.000Z"
  }
}
```

**Demo Data Examples:**

**Maintenance Request:**
```
category: maintenance
description: Water leakage in bathroom, room 301
```

**Academic Request:**
```
category: academic
description: Need transcript copy for scholarship application
```

**Lost & Found Request:**
```
category: lost-found
description: Lost my laptop charger in library yesterday
```

**General Request:**
```
category: general
description: Request for parking permit renewal
```

**Note:** All requests will automatically use the authenticated user's ID and name from the JWT token.

---

### 5. Update Request

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/requests/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

**Example URL:**
```
http://localhost:3000/api/requests/507f1f77bcf86cd799439011
```

**Body (JSON):**
```json
{
  "description": "Updated description: AC not working in room 205. Urgent!",
  "studentName": "John Doe Updated",
  "adminNotes": "Assigned to maintenance team"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "maintenance",
    "description": "Updated description: AC not working in room 205. Urgent!",
    "status": "pending",
    "studentId": "STU123",
    "studentName": "John Doe Updated",
    "adminNotes": "Assigned to maintenance team",
    "createdBy": "johndoe",
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T11:00:00.000Z"
  }
}
```

---

### 6. Update Request Status (Admin/Manager/Team Only)

**Method:** `PUT`  
**URL:** `http://localhost:3000/api/requests/:id/status`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
```

**Note:** Only users with role `admin`, `manager`, or `team` can access this endpoint.

**Example URL:**
```
http://localhost:3000/api/requests/507f1f77bcf86cd799439011/status
```

**Body (JSON):**
```json
{
  "status": "in-progress",
  "adminNotes": "Maintenance team assigned. Will fix by tomorrow."
}
```

**Valid Status Values:**
- `pending`
- `in-progress`
- `resolved`

**Example Bodies:**

**Mark as In Progress:**
```json
{
  "status": "in-progress",
  "adminNotes": "Work started. Expected completion: 2 hours."
}
```

**Mark as Resolved:**
```json
{
  "status": "resolved",
  "adminNotes": "AC fixed successfully. Tested and working."
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "category": "maintenance",
    "description": "AC not working in room 205",
    "status": "in-progress",
    "adminNotes": "Maintenance team assigned. Will fix by tomorrow.",
    "resolvedAt": null,
    "createdBy": "johndoe",
    "createdAt": "2024-12-08T10:00:00.000Z",
    "updatedAt": "2024-12-08T12:00:00.000Z"
  }
}
```

**Note:** When status is set to `resolved`, `resolvedAt` field is automatically set to current timestamp.

---

### 7. Delete Request (Admin/Manager/Team Only)

**Method:** `DELETE`  
**URL:** `http://localhost:3000/api/requests/:id`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Note:** Only users with role `admin`, `manager`, or `team` can access this endpoint. This performs a soft delete.

**Example URL:**
```
http://localhost:3000/api/requests/507f1f77bcf86cd799439011
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

**Note:** After deletion, the request will have `deletedBy` and `deletedAt` fields set, and will be excluded from all queries.

---

### 8. Get User's Requests

**Method:** `GET`  
**URL:** `http://localhost:3000/api/requests/user/:userId`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Example URL:**
```
http://localhost:3000/api/requests/user/STU123
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "category": "maintenance",
      "description": "AC not working in room 205",
      "status": "pending",
      "studentId": "STU123",
      "studentName": "John Doe",
      "createdBy": "johndoe",
      "createdAt": "2024-12-08T10:00:00.000Z",
      "updatedAt": "2024-12-08T10:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "category": "academic",
      "description": "Need transcript copy",
      "status": "resolved",
      "studentId": "STU123",
      "studentName": "John Doe",
      "createdBy": "johndoe",
      "createdAt": "2024-12-07T09:00:00.000Z",
      "updatedAt": "2024-12-07T15:00:00.000Z"
    }
  ]
}
```

---

## Quick Reference Table

| Method | Endpoint | Auth Required | Role Restriction | Description |
|--------|----------|---------------|------------------|-------------|
| GET | `/api/requests/count` | ✅ | None | Get total request count |
| GET | `/api/requests` | ✅ | None | Get all requests (paginated) |
| GET | `/api/requests/:id` | ✅ | None | Get request by ID |
| POST | `/api/requests` | ✅ | None | Create new request |
| PUT | `/api/requests/:id` | ✅ | None | Update request |
| PUT | `/api/requests/:id/status` | ✅ | admin, manager, team | Update request status |
| DELETE | `/api/requests/:id` | ✅ | admin, manager, team | Delete request (soft delete) |
| GET | `/api/requests/user/:userId` | ✅ | None | Get user's requests |

---

## Testing Tips

1. **Get Token First:** Always sign in first to get your JWT token
2. **Use Environment Variables:** Set up Postman environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: Your JWT token (update after sign in)
3. **Test Different Roles:** Create users with different roles (admin, manager, team, student) to test role-based restrictions
4. **File Upload:** For POST `/api/requests`, use `form-data` type and select `File` type for the `attachment` field
5. **Error Handling:** Test with invalid IDs, missing fields, and unauthorized access

---

## Common Error Responses

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 Forbidden (Role Restriction):**
```json
{
  "success": false,
  "message": "Access denied. Required roles: admin, manager, team"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Request not found"
}
```

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "message": "Category and description are required"
}
```

