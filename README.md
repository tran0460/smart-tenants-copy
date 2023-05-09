# Smart Tenant - Admin Portal

## Table of content

[Description](#description)

[Installation](#installation)

[Design](#design)

[Screens](#screens)

[Data flow](#data-flow)

[Firebase hosting](#firebase-hosting)

[Github deployment automation](#github-deployment-automation)

---

## Description

The web portal for administrators to oversee the content and manage users of the Smart Tenant mobile App

---

## Installation

1. Clone the project to your local machine
2. Open it in your IDE, then run the following command to install the dependencies for the main folder

```
$ npm i
```

3. Go to the functions folder and run the following command to install the dependencies for **_Firebase Functions_**

```
(If you are in the main folder)
$ cd functions
$ npm i
$ cd ..
```

4. Create an environment file (.env) with the following variables

```json
REACT_APP_APP_API_KEY= "AIzaSyA-MHmZ-qa3IEA4I9JaxExqfPdkUh9lgig"
REACT_APP_AUTH_DOMAIN= "son-demo-project.firebaseapp.com"
REACT_APP_DATABASE_URL= "https://son-demo-project-default-rtdb.firebaseio.com"
REACT_APP_PROJECT_ID= "son-demo-project"
REACT_APP_STORAGE_BUCKET= "son-demo-project.appspot.com"
REACT_APP_MESSAGING_SENDER_ID= "318344122239"
REACT_APP_APP_ID= "1:318344122239:web:91f152baed6ba7e46c144a"
REACT_APP_MEASUREMENT_ID= "G-JE5YZF6K9V"
```

> Why do you have to do this?
>
> The api keys for the app is stored in environment variables for flexibility. We will need to switch back and forth between the api keys for the production server and development server

5. Run the app locally using the following command:

```
$ npm start
or
$ npm run preview
```

> ### Commands guide
>
> | Syntax          | Description                                               |
> | --------------- | --------------------------------------------------------- |
> | npm start       | Run the app locally on a port (usually 3000)              |
> | npm run build   | Generate a production build                               |
> | npm run preview | Generate a production build AND host it on a local server |

---

## Design

All of the designs for the web portal can be found in this [link](https://www.figma.com/file/2LKqA8ThjN9JZhQHB2I8D1/Smart-Tenant-%7C-Phase-2-%7C-May-2022?node-id=0%3A1)

---

## Screens

- [x] Login flow (login, forgot password, create new password)
- [x] Tenants screen (Tenants tab)
- [x] Announcements screen (Communication tab)
- [x] Notices screen (Communication tab)
- [x] Newsfeed screen (Newsfeed tab)
- [x] Marketplace screen (Marketplace tab)
- [ ] Buildings screen (Teams tab)
- [ ] Team screen (Buildings tab)
- [ ] Settings screen

---

## Data flow

A brief summary of the data flow can be found [here](https://www.figma.com/file/TDqm7QHgA8ZU7WVryA1rP8/Smart-Tenant---Admin-Portal-%2F-Brief-summary?node-id=0%3A1)

---

## Firebase hosting

In order to host the react app on firebase hosting, there are two commands you have to run

```
$ npm run build
$ firebase deploy hosting
```

_npm run build_ will generate a production build of the web app, and _firebase deploy hosting_
will deploy the production build to the current domain associated with the project.

Thats how to do it manually, but we don't do that here. We've set up an automated deployment workflow via push/pull requests.

---

## Github deployment automation

There are 2 github workflows for the project:

- Generate a preview channel for every pull request (any branch)
- Update the main channel for every merge request to the _main_ branch

In both workflows, the environment variables are set, their values are stored in github secrets.
