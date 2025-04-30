# Recipe Nest

Recipe Nest is a chef-centric full-stack web application designed to connect chefs and food enthusiasts, which serves as a platform for sharing recipes, showcasing culinary talents and fostering a global culinary community.

## Features

### Frontend

- **Guest and Authenticated Views**: Separate interfaces for food lovers and registered chefs.
- **Recipe Management**: View, add, edit and delete recipes.
- **Chef Profiles**: Explore chef profiles and their recipes.
- **Interactive UI**: Carousel for top chefs, responsive design and dynamic content loading.
- **Social Sharing**: Share recipes on social media platforms.
- **Likes/Dislike Counts**: Like and Dislike recipes.

### Backend

- **Authentication**: Secure login and registration using JWT.
- **API Endpoints**: RESTful APIs for managing chefs, recipes, and user interactions.
- **Database Integration**: SQLite database for storing user, recipe, and chef data.
- **Entity Framework Core**: Used for database migrations and data access.

## Tech Stack

### Front-end

- **React**: For building the user interface.
- **React Router**: For navigation and routing.
- **CSS**: Custom styles for a visually appealing design.
- **Vite**: For fast development and build processes.

### Back-end

- **ASP.NET Core**: For building the API.
- **Entity Framework Core**: For database management.
- **SQLite**: Lightweight database for development.

## Installation

### Prerequisites

- [Node.js v22.15.0 or higher](https://nodejs.org/en/download)
- npm v10.9.2 or higher
- [ASP.NET SDK v6.0 or higher](https://dotnet.microsoft.com/en-us/download/visual-studio-sdks)
- [SQLite extension](https://marketplace.visualstudio.com/items/?itemName=alexcvzz.vscode-sqlite)
- [Visual Studio Code](https://code.visualstudio.com/download)

### Steps

1. Download and install all prerequisites

- Verify the Node.js version: Use command `node -v` which should print "v22.15.0".
- Verify npm version: Use command `npm -v` which should print "10.9.2".
  
1. Clone the repository:

   ```bash
   git clone https://github.com/techgirldiaries/RecipeNest.git

2. Navigate to the backend directory:

   ```bash
   cd RecipeNestAPI
   ```

3. Run the backend:

   ```bash
   dotnet run --launch-profile http
   ```

4. Open the application for backend at <http://localhost:5120> by ctrl + click on the Link .

5. Open a new terminal and Navigate to the front-end directory:

   ```bash
      cd recipe-nest
   ```

6. Install frontend dependencies:

   ```bash
   npm install
   ```

7. If you are encountering issues while installing frontend dependencies, try this method:

   ```bash
   npm install --legacy-peer-deps
   ```

8. Run the frontend:

   ```bash
   npm run dev
   ```

9. To open the application in the Local (browser view) and Network (mobile view), ctrl + click on the links.

## API Endpoints

### Authentication

- POST /api/auth/login: Login a user.
- POST /api/auth/register: Register a new user.

### Recipes

- GET /api/auth/recipes/all: Fetch all recipes.
- POST /api/auth/recipes: Add a new recipe.
- DELETE /api/auth/recipes/{id}: Delete a recipe.

### Chefs

- GET /api/auth/chefs: Fetch all chefs.
- GET /api/auth/chefs/{id}: Fetch a specific chef's profile.

## Application Flow or Usage

1. **Guest/Food Lover**:
   - Log in with any email to browse recipes.
   - View chef profiles and their recipes.
   - Like or dislike recipes as a guest.

2. **Registered Users**:
   - Create an account and log in as a chef.
   - Add, edit or delete your own recipes.
   - View and manage your profile.
   - Change account settings
   - Interact with other chefs' recipes.

3. **Chef Features**:
   - Access the dashboard to manage account and recipes.
   - View analytics for guest or food lover interactions.

## Screenshots

[![Homepage](https://i.postimg.cc/jqy12wwL/Main-page.png)](https://postimg.cc/bdNgFvRh)
[![Recipe page](https://i.postimg.cc/SR4DCd2j/Food-Lover-Recipes-View-page.png)](https://postimg.cc/S2Z6pWGp)

## Contributing

To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes and push to your fork:

   ```bash
   git commit -m "Description of changes"
   git push origin feature-name
   ```

4. Submit a pull request to the main repository.

Please ensure your code follows the project's coding standards and includes relevant tests.

## Testing

To run tests for the backend:

1. Navigate to the `RecipeNestAPI` directory:

   ```bash
   cd RecipeNestAPI
   ```

2. Run the tests using the .NET CLI:

   ```bash
   dotnet test
   ```

To test the frontend:

1. Navigate to the `Recipe-nest` directory:

   ```bash
   cd ..
   then, cd Recipe-nest
   ```

2. Run the tests using npm:

   ```bash
   npm test
   ```

## Deployment

To deploy Recipe Nest:

1. Build the frontend:

   ```bash
   cd src
   npm run build
   ```

   This will generate a `dist` folder with the production-ready frontend.

2. Publish the backend:

   ```bash
   cd ../RecipeNestAPI
   dotnet publish -c Release -o ./publish
   ```

   This will generate a `publish` folder with the production-ready backend.

3. Deploy both the frontend and backend to your hosting provider (e.g., Azure, AWS, or Heroku).

## Future Enhancements

- Add recipe ratings and reviews.
- Implement a subscription model for premium features.
- Introduce a mobile app version.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Authors

Group 3 - Kwasi & Kemi - Recipe Nest Developers

## Acknowledgments

- [Nodejs](https://nodejs.org/) for the frontend framework.
- [React with Vite](https://vite.dev/guide/) for the frontend framework.
- [ASP.NET Core](https://dotnet.microsoft.com/) for the backend framework.
- [.NET CLI](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-run) to run backend development
- [Microsoft Entity Framework](https://learn.microsoft.com/en-us/ef/)
- [SQLite](https://www.sqlite.org/) for the database.

## FAQ

**Q: Can I use Recipe Nest without registering?**  
A: Yes, guests can browse recipes and interact with them without creating an account.

**Q: How do I reset my password?**  
A: Use the "Forgot Password" link on the login page to reset your password.
