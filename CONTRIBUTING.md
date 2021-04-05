# Contributing

## Team Norms

### Team Values

- When it comes to resolving conflicts on decision for the direction of RecipeBox, we'll have a vote amongst the five of us and the majority will take the cake. If someone tends to be super passionate about an idea they can plead their case.

- When a member is failing to complete their obligations, such as not completing their work timely or communicating clearly, contact either Scrum Master or Product Owner if you are not comfortable calling them out on your own during the next standup. Upon a second callout, talk to another member of the group and if you both confer the team member should be brought up to to Amos

- If one of the team members is having issues, with GitHub, Express, etc., then reach out to another team member for help or assistance learning / working on your part.

- When someone feels like they have too much work, bring it up during a standup to redistribute it. If someone is willing to take up the work great, otherwise do so by git commit numbers or something.

- As for our main form of communication, we will continue using the Slack channel. For secondary communication we will use Discord.

- When it comes to working on things, we don't always have to do things on our own. When we do things that require multiple people, like reviewing things in a call or using the same CSS, we can do those things together in a call or communicating via above channels while checking it freqently.

### Sprint Cadence

According to the class schedule, each sprint will last two weeks. This will focus on various aspects of the app that build up over the sprints (e.g. front end might be worked on during sprint 3 if something comes up).

### Daily Standups

Standups will happen three times a week on the following schedule.

Wednesday: 4:45 - 5:15 PM EST
Fridays: 2:00 - 2:30 PM EST
Sundays: 8:00 - 8:30 PM EST

Standups will [take place on Zoom](https://nyu.zoom.us/j/96743743979) on a re-occurring link. They will last approx 30 minutes as a high end estimate, with the "actual" standup lasting 5 to 15 minutes, and the rest of the time spent working on tasks, code review, and sprint planning. Zoom link in case the hyperlink does not work: [https://nyu.zoom.us/j/96743743979](https://nyu.zoom.us/j/96743743979).

### Coding Standards

The editor we will be using is **VS Code.** Linting follows the AirBnB standard and is run with eslint. _CI TBD._

## Git Workflow of RecipeBox

RecipeBox uses a simple git workflow of develop branches.

For any user's current progress, they push to a develop branch with their name, e.g. `John-develop`, and create a PR when they are ready to add their changes to the trunk of the project.

## How to Contribute

You can contribute to recipebox by first forking the project and creating your own repository. Create a branch that contains **issue number** that you are working on followed by a **/** with a short version of the task at hand.

When creating a PR, request to merge with the _develop_ branch. 

_RecipeBox is currently being written, so contributing is currently not something we're looking for. If you're somehow here... thanks for your interest!_

## Building and Testing

Once you have pulled the repository, the back-end and front-end must be run separately. If you are testing anything like form submissions or loading recipes anywhere on the app, you must run the back-end! That's where all of our routes are.

### Front End

1. Navigate to your repository and into the `front-end` folder. Open a bash terminal and run `npm install`
1. Once packages have finished installing, go ahead and run `npm start`
1. The front-end server will begin running on `http://localhost:3000` by default, or some available port if you are prompted
1. Edit as you wish!

### Back End

1. Navigate to your repository and into the `back-end` folder. Open a bash terminal and run `npm install`
1. Once packages have finished installing, you can use `nodemon server` to go ahead and start up the server
    - If you are curious about the routes, you can find all get and post routes in `back-end/app.js`
1. The back-end server will begin running on `http://localhost:4000` by default. 
    - _Do not change the port!_ It is specified so that the front-end can communicate with the back-end.
1. To run any unit tests, simply run `npm test`
1. Edit as you wish!