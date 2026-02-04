# Orthodox Hymn Platform API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Admin Login
**POST** `/auth/login`

Authenticates an admin or moderator user and returns a JWT token.

**Request Body:**
```json
{
  "email": "admin@orthodoxhymn.com",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@orthodoxhymn.com",
      "role": "admin"
    }
  }
}
```

### Verify Token
**POST** `/auth/verify`
*Headers: Authorization: Bearer <token>*

Verifies if the current token is valid.

### Logout
**POST** `/auth/logout`
*Headers: Authorization: Bearer <token>*

Logs out the user (client-side should also remove token).

---

## App Versions

### Get All Versions
**GET** `/versions`

Returns a paginated list of app versions.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `activeOnly` (true/false)

### Get Latest Version
**GET** `/versions/latest`

Returns the latest active version information.

### Get Version by ID
**GET** `/versions/:id`

Returns details of a specific version.

### Download APK
**GET** `/versions/:id/download`

Initiates the download of the APK file for the specified version. Tracks the download event.

### Create Version (Admin)
**POST** `/versions`
*Headers: Authorization: Bearer <token>, Content-Type: multipart/form-data*

Uploads a new version.

**Form Data:**
- `apk`: (File) The APK file
- `version_number`: "1.0.0"
- `version_name`: "Initial Release"
- `changelog`: "Description of changes"
- `release_date`: "2024-01-01"

### Update Version (Admin)
**PATCH** `/versions/:id`
*Headers: Authorization: Bearer <token>*

Updates version details.

**Request Body:**
```json
{
  "version_name": "Updated Name",
  "is_active": false
}
```

### Delete Version (Admin)
**DELETE** `/versions/:id`
*Headers: Authorization: Bearer <token>*

Deletes a version and its associated file.

---

## Reviews

### Get Reviews
**GET** `/reviews`

Get approved reviews for the app.

**Query Parameters:**
- `versionId`: Filter by version
- `page`, `limit`

### Submit Review
**POST** `/reviews`

Submit a new review.

**Request Body:**
```json
{
  "version_id": 1,
  "reviewer_name": "John Doe",
  "review_text": "Great app!"
}
```

### Approve Review (Admin)
**PATCH** `/reviews/:id/approve`
*Headers: Authorization: Bearer <token>*

Approves a review to be visible publicly.

### Feature Review (Admin)
**PATCH** `/reviews/:id/feature`
*Headers: Authorization: Bearer <token>*

**Request Body:**
```json
{
  "is_featured": true
}
```

### Delete Review (Admin)
**DELETE** `/reviews/:id`
*Headers: Authorization: Bearer <token>*

Soft deletes a review.

---

## Ratings

### Submit Rating
**POST** `/ratings`

Submit a 1-5 star rating.

**Request Body:**
```json
{
  "version_id": 1,
  "rating": 5
}
```

### Get Rating Stats
**GET** `/ratings/:versionId/stats`

Get average rating and distribution for a version.

### Check User Rating
**GET** `/ratings/:versionId/check`

Check if the current IP has already rated this version.

---

## Feedback

### Submit Feedback
**POST** `/feedback`

Submit bug reports, suggestions, or blessings.

**Request Body:**
```json
{
  "type": "bug", // bug, suggestion, blessing
  "name": "User Name",
  "email": "user@example.com",
  "message": "The feedback message"
}
```

### Get All Feedback (Admin)
**GET** `/feedback`
*Headers: Authorization: Bearer <token>*

**Query Parameters:**
- `type`: Filter by type
- `status`: Filter by status (pending, reviewed, resolved)

### Respond to Feedback (Admin)
**POST** `/feedback/:id/respond`
*Headers: Authorization: Bearer <token>*

**Request Body:**
```json
{
  "admin_response": "Thank you for your feedback.",
  "status": "resolved"
}
```

### Get Feedback Stats (Admin)
**GET** `/feedback/stats`
*Headers: Authorization: Bearer <token>*

---

## Analytics

### Get Dashboard Analytics (Admin)
**GET** `/analytics/dashboard`
*Headers: Authorization: Bearer <token>*

Returns aggregate statistics for the admin dashboard:
- Total downloads
- Recent activity
- Review stats
- Version performance
