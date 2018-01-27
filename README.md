# Aspire App

### Collaborators
* Christian Schweizer
* Koby Craig
* Liam Cassidy
* Matt Garcia
* Regan Townsend
* Ryan Henness

Application Structure
=================

> Structure and purpose of our Node application components

    .
    ├── routes              # Determines how an application responds to a client request
    │   ├── pages.js            # General application routes, such as the index 
    │	├── passport.js         # Connects to Passport, which enables Facebook authentication   
    │   └── pg.js               # Connects to our PostgreSQL server hosted by Heroku.com
    ├── views               # Page templates 
    │   └── partials            # Common components that are included in more than one view, such as a header             
    ├── index.js            # Initializes application      
    ├── package.json        # Defines Node packages needed by application
    └── README.md           


DEV NOTES:
- Implement Promises for db calls
- Create node package for db functions