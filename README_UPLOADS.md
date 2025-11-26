# Image Upload Functionality

This project uses Multer middleware for handling image uploads.

## How it works

1. Images are uploaded to the `uploads/` directory
2. The filename is randomized to prevent conflicts
3. Only image files (jpg, jpeg, png, gif) are accepted
4. Maximum file size is 5MB

## Usage

### Frontend Implementation

To upload an image, send a POST request to `/api/books/add` with a form-data payload:

```
POST /api/books/add
Content-Type: multipart/form-data

Fields:
- userId: [User ID]
- title: [Book Title]
- author: [Book Author]
- genre: [Book Genre]
- description: [Book Description]
- image: [Image File]
```

### Backend Implementation

The upload middleware is already configured in `middleware/upload.js` and applied to the book routes in `routes/bookRoutes.js`.

## Accessing Uploaded Images

Uploaded images can be accessed via:
```
GET /uploads/[filename]
```

## Configuration

The upload configuration can be modified in `middleware/upload.js`:
- Storage destination
- Filename format
- File size limits
- Accepted file types