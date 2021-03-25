# Restful chinook
## (Muziek-project)
...

---

## User Story Dependencies

![Story Dependency Diagram](https://github.com/bermarte/Restful-chinook/blob/main/project-planning/user%20story.png?raw=true)

---

## WIREFRAME

![wireframe]()

---

## 0.Setup
- Start a repo and clone it to directory
- Add collaborators
- Set up a project board
- Create the backlog
- Design a wireframe to set guidelines for UI/UX design.
- Devise a development strategy
- Create initial README file
- Each developed branch is merged to `master` branch after completion
---

## Back-End

- `db-connection.js` connect the database with SQLite3

### 1. User Story: Tracks
Create a fully-functioning API, routes and path:
- `/api/tracks` to view tracks data such as `TrackId`, `Name`, `AlbumId`, `MediaTypeId`, `GenreId`, `Composer`, `Milliseconds`, `Bytes`, `UnitPrice`
- `/api/tracks/search/:items`
- `/api/tracks/add`
- `controller.js`, `routes.js`, `index.js`

### 2. User Story: Playlists

Create a fully-functioning API route:
- `/api/playlist` to view `PlaylistId`, `Name`
- `controller.js`, `routes.js`, `index.js`

### 3. User Story: Albums

Create a fully-functioning API route:
- `/api/albums` to view `AlbumId`, `Title`, and `ArtistId`
- `controller.js`, `routes.js`, `index.js`

### 4. User Story: Artists

Create a fully-functioning API route:
- `/api/artists` to view `ArtistId`, `Name`
- `controller.js`, `routes.js`, `index.js`

### 5. User Story: Genres

Create a fully-functioning API route:
- `/api/genres` to view `GenreId`, `Name`
- `controller.js`, `routes.js`, `index.js`

### 6. User Story: Media-types

Create a fully-functioning API route:
- `/api/media-types` to view `MediaTypeId`, `Name`
- `controller.js`, `routes.js`, `index.js`
### 7. User Story: Sales
Create a fully-functioning API routes and path:
- `/api/sales`
- `/api/sales/country`
- `/api/sales/year`

### 8. User Story: Catalog

Create a fully-functioning API route:
- `/api/catalog`

### 9. User Story : Customers

Create a fully-functioning API routes and path:
- `/api/customers`
- `/api/customers/add`
## Front-End

- Design the wireframe with Figma
- Create accessible website built with HTML, CSS and JS
- Create input element div element for each display section
- Styling of the html document and its body styling of the background, inner content and lists (with CSS framework)

## Finishing Touch

## Deploy the App if everything are working

- Heroku
---


