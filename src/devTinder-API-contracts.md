# Dev Tinder API's

## AuthRouter
- POST /signup
- POST /login
- POST /logout

------------------------------
## ProfileRouter
- GET /profile/view
- PATCH /profile/edit  // to update user profile.
- PATCH /profile/password  // to update password or forgot password.

------------------------------
## ConnectionRequestRouter
### Sending a connection request
### Statuses: IGNORE/D ( If user wants to pass or left swipe a profile), INTERESTED ( If user likes or right swipes the profile)
- POST /request/send/interested/:id ( If user right swipes or likes a profile);
- POST /request/send/ignored/:id ( If user left swipes or dislikes a profile);

### Receiving a connection request
### Statuses: ACCEPTED ( If user accepts a connection request), REJECTED ( If user does not accepts the connection request)
- POST /request/review/accepted/:requestId ( If user accepts a connection request);
- POST /request/review/rejected/:requestId ( If user rejects a connection request );

------------------------------
## UserRouter
- GET /user/connections (These are all the user's connection or matches)
- GET /user/requests/received ( All the connection request a user has received )
- GET /user/feed ( This API gives you the profiles of other users, which you can either left/right swipe)