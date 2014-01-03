leaguebook
==========

App to easily find League of Legends players from different colleges.

## Ready
    npm install

## Set the Database

###Install postgres, have it start on login, then load it now.    
    brew install postgres
    ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

###Enter postgres console and create leaguebook user
    psql -h localhost postgres
    create user leaguebook with password 'leaguebook';
    alter role leaguebook superuser;

###Create leaguebook db and give leaguebook user acess
    create database leaguebook;
    grant all on database leaguebook to leaguebook

###Navigate to the src directory then run the db setup scripts
    node dbSetup
    node collegeSetup

## Go
    node ./src/main.js
