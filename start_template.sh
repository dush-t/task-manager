#!/bin/bash
#give this file executable permissions by navigating to it's directory and running 
# chmod +x ./start_template.sh
# then to run the application do - 
# ./start_template.sh <name of npm script to run>

export PORT=3000
export SG_APIKEY= # Your sendgrid api key here
export JWT_SECRET= # Your jwt secret key here (can be any random string of your choice)

if [ $1 == "test" ]
then 
    export MONGODB_URL= # Your test database url here
else
    export MONGODB_URL= # Your dev database url here
fi

printenv MONGODB_URL
npm run $1