# SkillSwap Frontend — SkillExchangeNetwork

This is a vanilla HTML/CSS/JavaScript frontend for the Spring Boot project in your ZIP. It uses the API paths currently declared in your controllers.

## Files
- `index.html` — app layout and dialogs
- `styles.css` — responsive design
- `app.js` — API integration, navigation, forms, and rendering

## Option A (recommended): serve from Spring Boot
1. Copy `index.html`, `styles.css`, and `app.js` into:
   `src/main/resources/static/`
2. Start the Spring Boot application.
3. Open `http://localhost:8081/`

Because the UI and API share the same origin, browser CORS is not needed for this frontend.

## Option B: use VS Code Live Server
1. Open this folder in VS Code.
2. Install/enable Live Server and open `index.html` with it.
3. In `app.js`, keep `API_BASE` as `http://localhost:8081/api` for Live Server on port 5500 or 5501.
4. Your backend controllers currently allow `http://127.0.0.1:5500`. If Live Server opens at `http://localhost:5500` or another port, update each controller's `@CrossOrigin` or the global CORS config to allow the exact origin.

## Important backend notes
- The frontend uses your existing API routes: `/api/users`, `/api/userProfile`, `/api/skill`, `/api/userSkill`, `/api/exchangeRequest`, `/api/message`, `/api/notification`, and `/api/review`.
- The frontend assumes the login/register response contains the user's `id`, `name`, `email`, and `phone`.
- The backend's `UserService` currently compares plain-text passwords and returns a User entity. This is not safe for a public deployment. Use BCrypt/password hashing and return a response DTO that never exposes the password before deploying publicly.
- The current backend has two `@GetMapping` methods in `ReviewController` with the same `/api/review/getreviews/{...}` route, which can cause an ambiguous mapping at startup. Rename one route (for example `/getreceived/{userId}` and `/getwritten/{userId}`) and update the frontend route as needed.
- `UserProfileController` has overlapping `@GetMapping("{id}")` and `@GetMapping("{cityName}")` patterns. If Spring reports ambiguous mappings, change the city route to something explicit like `/city/{cityName}`.
- `UserProfileService.updateProfile` currently doesn't update the `available` property even though the DTO has it.
- The catalog skill creation UI uses your existing `POST /api/skill/add/{profileId}` endpoint; that endpoint accepts a raw JSON string containing the skill name and adds it to the profile. It does not save a description.
- Local browser storage stores only basic user details, not the password. This is a lightweight learning-project login flow, not secure authentication/session management.

## Features
- Sign in and registration
- Overview dashboard and community skill catalog
- Search skill names and users
- Add a user's TEACH/LEARN skill and experience level
- Send, accept, reject, and complete exchange requests
- Messaging and notifications
- User profile editing and reviews
- Responsive desktop/mobile layout

Some API actions may need small backend fixes if the current controller/service implementation has mapping, JSON serialization, or persistence issues. The frontend reports API errors as toast messages rather than silently swallowing user actions.
