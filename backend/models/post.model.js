
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    
    
    },
    text: {
        type: String
    },
    img: {
        type: String,
        
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        
        }
    ],

    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        }

    ]
},{timestamps: true})

const Post = mongoose.model('Posts',postSchema);
export default Post;


/* 

Here's a detailed breakdown of the `User` schema and its important points:

### Mongoose Schema:
1. **mongoose.Schema()**: Defines the structure for documents in the MongoDB collection. Each field in the schema is associated with a data type and certain validation rules.

### Important Fields in the `UserSchema`:

1. **username**:
   - **Type**: `String`
   - **Constraints**: `required`, `unique`
   - **Explanation**: This is the user's unique identifier. The `required` constraint ensures that every user must have a username, and the `unique` constraint prevents duplicate usernames in the database.

2. **fullName**:
   - **Type**: `String`
   - **Constraints**: `required`
   - **Explanation**: Represents the full name of the user. The `required` constraint ensures that every user has to provide their full name.

3. **email**:
   - **Type**: `String`
   - **Constraints**: `required`, `unique`
   - **Explanation**: Stores the user's email address, which is both mandatory and unique. This prevents two users from having the same email.

4. **password**:
   - **Type**: `String`
   - **Constraints**: `required`, `minLength: 6`
   - **Explanation**: Stores the user's password. The `minLength: 6` ensures that the password is at least 6 characters long for security purposes.

5. **followers**:
   - **Type**: Array of ObjectIds (references to "User")
   - **Default**: `[]`
   - **Explanation**: This is an array of references (foreign keys) to other user documents, representing the users following this account. The `ref: "User"` indicates a relationship with the User model.

6. **following**:
   - **Type**: Array of ObjectIds (references to "User")
   - **Default**: `[]`
   - **Explanation**: This is an array that stores the users whom this user is following. Like `followers`, it references other User documents.

7. **profileImg**:
   - **Type**: `String`
   - **Default**: `""`
   - **Explanation**: Stores the URL of the user's profile image. If the user hasn't uploaded a profile image, the default value will be an empty string.

8. **coverImg**:
   - **Type**: `String`
   - **Default**: `""`
   - **Explanation**: Stores the URL of the user's cover image, with an empty string as the default value when the cover image isn't set.

9. **bio**:
   - **Type**: `String`
   - **Default**: `""`
   - **Explanation**: Contains the user's biography or short description. It defaults to an empty string if the user hasn’t set it.

10. **link**:
    - **Type**: `String`
    - **Default**: `""`
    - **Explanation**: Stores any link that the user wants to share, such as a personal website or social media link.

11. **likedPosts**:
    - **Type**: Array of ObjectIds (references to "Post")
    - **Default**: `[]`
    - **Explanation**: Contains an array of posts that the user has liked. The `ref: "Post"` establishes a relationship with the Post model.

### Schema Options:

- **timestamps: true**:
   - **Explanation**: This adds two fields to the schema: `createdAt` and `updatedAt`, which automatically track when a user document is created and last updated.

### Mongoose Model:

- **const User = mongoose.model("User", UserSchema)**:
   - **Explanation**: This creates the `User` model based on the `UserSchema`. The `User` model provides methods for interacting with the `users` collection in MongoDB (e.g., CRUD operations).

### Key Points:

1. **Data Integrity**: Enforces unique usernames and emails, ensuring that user accounts are distinguishable.
2. **Relationships**: Defines relationships between users (followers and following) and with posts (likedPosts) using references.
3. **Security**: Password has a `minLength` constraint, encouraging stronger passwords.
4. **Scalability**: The use of arrays (followers, following, likedPosts) allows easy growth as users interact with the platform.
5. **Default Values**: Provides sensible default values for fields like `profileImg`, `coverImg`, and `bio`, so even if these are not provided, the schema remains valid.
*/