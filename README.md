# Aspire App

### Collaborators
* Christian Schweizer
* Koby Craig
* Liam Cassidy
* Matt Shimizu
* Regan Townsend
* Ryan Henness

Application Structure
=================

> Structure and purpose of our Node application components

    .
    ├── data # Mechanical Engineering static data
    │   ├── conversions.js # Relatable conversions
    │   ├── foodrecycle.js # Food and recycle conversion table
    │   ├── transportation.js # Transportation Conversion table
    ├── routes              # Determines how an application responds to a client request
    │   ├── pages.js            # General application routes, such as the index 
    │	├── passport.js         # Connects to Passport, which enables Facebook authentication   
    │   └── pg.js               # Connects to our PostgreSQL server hosted by Heroku.com
    ├── views               # Page templates 
    │   ├── partials            # Common components that are included in more than one view, such as a header 
    │    │   └── bootstrap.ejs       # Add Bootstrap for UI elements
    │    │   └── navbar.ejs          # Navigation bar for each page
    │    ├── foodrecycle.ejs    # Page for environmental impact from materials and waste methods
    │    ├── home.ejs           # Home page, displaying user profile and activity feed
    │    ├── login.ejs          # Page for logging in and setting up the user
    │    ├── map.ejs            # Transportation page utilizing Google Maps API
    │    ├── settings.ejs       # Settings page to configure user's car and home info
    ├── index.js            # Initializes application      
    ├── package.json        # Defines Node packages needed by application
    └── README.md           


DEV NOTES:
- Implement Promises for db calls
- Create node package for db functions
