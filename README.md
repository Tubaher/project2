<!-- Universidad Yachay Tech
Diego Hernán Suntaxi Domínguez
Curso de Web Programming
Prof. Rigoberto Fonseca  -->
### Project 2
**https://github.com/Tubaher/project2**

Web Programming with Python and JavaScript.

My project represents a webchat. Its server part is written using Python based Flask microframework and client part uses Javascript and SocketIO. As to my project's frontend, I used MaterialCSS framework.

When a user specifies a username, it is then stored in localStorage. Because of that user doesn't have to specify his or her username again after closing the browser. Similarly, current channel name that user joined last time is also stored in localStorage.

Besides the features I have implemented according to CS50 requirements I have added support for file uploads.

### Pre-requirements 📋

Things you need to install


```
sudo apt-get git
```
And your favorite web browser.
### Installation 🔧

First, clone the repository in your local machine

```
git clone <the embed repository>
```

Access to the folder

```
cd project1
```

Then create a venv (recommended)

```
python3 -m venv myvenv

source myvenv/bin/activate

```
After that, install the requirements

```
pip3 install -r requirements.txt
```
Set the enviroment variables (look below)

```
source setup.sh (for an easy method just excecute this line)
```
Excecute the app

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


## Authors ✒️

* **Diego Suntaxi** - *Development* - [Tubaher](https://github.com/Tubaher)
