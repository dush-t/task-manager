# task-manager
RESTful API - powered by node.js - for a recruitments portal for technical clubs and departments of BITS Pilani


## Setup - 
1. Clone the repository to your computer.
2. Navigate to the folder in a terminal by `cd path/to/folder`
3. Run the command `npm install`. This will install all dependencies. (make sure you have read/write permissions for that folder)
4. In start_template.sh, enter the valid data as mentioned in comments.
5. Run `sudo chmod +x ./start_template.sh` from the terminal.
6. To start the server in development mode, run `./start_template.sh dev`. To start it in test mode, run `./start_template.sh test`,
and to start it in production mode, run `./start_template.sh start`. For development purposes, start it in development mode only.

#### Note: In dev mode, saving any js file will restart the server.


## Rules for contributing - 
1. Go through the code and make sure you follow the same style.
2. Create a new pull request for each new feature.
3. If you fixed an issue, reference the issue number as _issue#<issue_number>_ in your commit message.
4. Write clear, concise commit messages.

## TO-DO - 
1. Write front-end for web app.
2. Write tests for the api.
3. Write a new rounds feature, such that clubs can add juniors to rounds and then specify if a junior passed the current round 
or not. Think of recruitment process of clubs like Hindi Drama Club, which are not task based.
4. Write chat feature using socket.io (Not important as of now).
