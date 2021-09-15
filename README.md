# Stackk
Small lil stack app

## Developing
Dev credentials are in .env.dist.

To develop locally you will need to boot up the devdb:

    npm run start:db

Then start the watch script using:

    Mac: npm run start:dev
    Windows: npm run start:dev:win

Data stored in the devdb is exported to `./localdbdata`, delete this file to clear the db.

You can view the contents of the db at [http://localhost:4000](http://localhost:4000/) once they are running.
