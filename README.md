## HarvardX CS50W: Web Programming with Python and JavaScript

### Course's link
See [here](https://www.edx.org/course/cs50s-web-programming-with-python-and-javascript).

### My certificate
See [here](https://courses.edx.org/certificates/ce24e09f0bb74979b9cfb4535e72d444).

### Requirements
In this project, you’ll build an online messaging service using Flask, similar in spirit to Slack. Users will be able to sign into your site with a display name, create channels (i.e. chatrooms) to communicate in, as well as see and join existing channels. Once a channel is selected, users will be able to send and receive messages with one another in real time. Finally, you’ll add a personal touch to your chat application of your choosing!

Here are the requirements:
  - Display Name: When a user visits your web application for the first time, they should be prompted to type in a display name that will eventually be associated with every message the user sends. If a user closes the page and returns to your app later, the display name should still be remembered.
  - Channel Creation: Any user should be able to create a new channel, so long as its name doesn’t conflict with the name of an existing channel.
  - Channel List: Users should be able to see a list of all current channels, and selecting one should allow the user to view the channel. We leave it to you to decide how to display such a list.
  - Messages View: Once a channel is selected, the user should see any messages that have already been sent in that channel, up to a maximum of 100 messages. Your app should only store the 100 most recent messages per channel in server-side memory.
  - Sending Messages: Once in a channel, users should be able to send text messages to others the channel. When a user sends a message, their display name and the timestamp of the message should be associated with the message. All users in the channel should then see the new message (with display name and timestamp) appear on their channel page. Sending and receiving messages should NOT require reloading the page.
  - Remembering the Channel: If a user is on a channel page, closes the web browser window, and goes back to your web application, your application should remember what channel the user was on previously and take the user back to that channel.
  - Personal Touch: Add at least one additional feature to your chat application of your choosing! Feel free to be creative, but if you’re looking for ideas, possibilities include: supporting deleting one’s own messages, supporting use attachments (file uploads) as messages, or supporting private messaging between two users.
  - In README.md, include a short writeup describing your project, what’s contained in each file, and (optionally) any other additional information the staff should know about your project. Also, include a description of your personal touch and what you chose to add to the project.
  - If you’ve added any Python packages that need to be installed in order to run your web application, be sure to add them to requirements.txt!

Beyond these requirements, the design, look, and feel of the website are up to you! You’re also welcome to add additional features to your website, so long as you meet the requirements laid out in the above specification!

### Project 2

Web Programming with Python and JavaScript.

My project represents a webchat. Its server part is written using Python based Flask microframework and client part uses Javascript and SocketIO. As to my project's frontend, I used MaterialCSS framework.

When a user specifies a username, it is then stored in localStorage. Because of that user doesn't have to specify his or her username again after closing the browser. Similarly, current channel name that user joined last time is also stored in localStorage.

Besides the features I have implemented according to CS50 requirements I have added support for file uploads.

#### Main file of the project
Main file of the project is `application.py`, which should be run with `python3 application.py`.

#### Environment variables
The application can take four optional environment variables:
  - `SECRET_KEY`. Secret key that Flask uses for encryption.
  - `FLASK_HOST`. IP or domain name to run the application on. Default is "127.0.0.1".
  - `FLASK_PORT`. Port. Default is 5000.
  - `UPLOAD_DIR`. A directory that Flask uses to store uploaded files. Default is "uploads". If the directory doesn't exist, it will be created upon application startup.

#### Main directories and files
  - `static`. Root directory with static files.
    - `scss`. SCSS source files.
    - `css`. CSS files compiled from SCSS source directory.
    - `js`. JS scripts used in the project.
      - `login.js`. Script that run on login page.
      - `chat.js`. All other scripts that run in chat.
  - `templates`. This directory contains Flask templates files.

The project's video: https://www.youtube.com/watch?v=fexGaM-OHKI
