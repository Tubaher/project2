
""" #Universidad Yachay Tech
#Diego Hernán Suntaxi Domínguez
#Curso de Web Programming
#Prof. Rigoberto Fonseca   """
import json
import os
import time

from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.utils import secure_filename


MESSAGES_LIMIT = 100

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["UPLOAD_DIR"] = os.getenv("UPLOAD_DIR")
socketio = SocketIO(app)

messages = {}
users_online_global = set()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login/")
def login():
    return render_template("login.html")


@app.route("/logout/")
def logout():
    return render_template("login.html")


@app.route("/get-channels/", methods=["POST"])
def get_channels():
    if not messages:
        return jsonify({"message": "no channel"}), 204
    else:
        return jsonify(list(messages.keys()))


@app.route("/get-messages/", methods=["POST"])
def get_messages():
    channel_name = request.form.get("channel_name")
    if channel_name not in messages:
        return jsonify({"message": "channel doesn't exist"}), 404
    elif not messages[channel_name]["messages"]:
        return jsonify({"message": "no message"}), 204
    else:
        return jsonify(messages[channel_name]["messages"])


@app.route("/get-users/", methods=["POST"])
def get_users():
    channel_name = request.form.get("channel_name")
    if channel_name not in messages:
        return jsonify({"message": "channel doesn't exist"}), 404
    elif not messages[channel_name]["users"]:
        return jsonify({"message": "no user"}), 204
    else:
        return jsonify(list(messages[channel_name]["users"]))


@app.route("/receive-file/", methods=["POST"])
def receive_file():
    channel_name = request.form.get("channel_name")
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "empty file name"}), 204

    filename = secure_filename(file.filename)
    new_filename = os.path.join(app.config['UPLOAD_DIR'], filename)
    if os.path.isfile(new_filename):
        # File already exists
        pass

    file.save(new_filename)
    link = "/download/" + filename
    return jsonify({"message": "file saved",
                    "filename": filename,
                    "link": link}), 201


@app.route("/download/<filename>")
def download(filename):
    if not os.path.isfile(os.path.join(app.config['UPLOAD_DIR'], filename)):
        return jsonify({"message": "file not found"}), 404

    return send_from_directory(app.config["UPLOAD_DIR"],
                               filename,
                               as_attachment=True)


@socketio.on("user connected")
def connected(data):
    username = data["username"]
    users_online_global.add(username)


@socketio.on("user disconnected")
def disconnected(data):
    username = data["username"]
    users_online_global.discard(username)
    for channel_name in messages.keys():
        messages[channel_name]["users"].discard(username)


@socketio.on("channel created")
def channel_created(data):
    channel_name = data["channel_name"]
    if channel_name not in messages:
        messages[channel_name] = {
            "users": set(),
            "messages": []
        }
        emit("announce channel",
             {"channel_name": channel_name},
             broadcast=True)


@socketio.on("join")
def channel_entered(data):
    channel_name = data["channel_name"]
    username = data["username"]
    join_room(channel_name)
    messages[channel_name]["users"].add(username)
    emit("user joined",
         {"channel_name": channel_name,
          "username": username,
          "timestamp": time.time()},
         room=channel_name)


@socketio.on("leave")
def channel_leaved(data):
    channel_name = data["channel_name"]
    username = data["username"]
    leave_room(channel_name)
    messages[channel_name]["users"].discard(username)
    emit("user leaved",
         {"channel_name": channel_name,
          "username": username,
          "timestamp": time.time()},
         room=channel_name)


@socketio.on("message sent")
def message_sent(data):
    channel_name = data["channel_name"]
    username = data["username"]
    message = data["message"]
    timestamp = time.time()
    if channel_name not in messages:
        messages[channel_name] = {
            "users": set(),
            "messages": []
        }
    messages[channel_name]["messages"].append({
        "username": username,
        "message": message,
        "timestamp": timestamp
    })
    if len(messages[channel_name]["messages"]) > MESSAGES_LIMIT:
        messages[channel_name]["messages"] = messages[channel_name]["messages"][-MESSAGES_LIMIT:]
    emit("announce message",
         {"channel_name": channel_name,
          "username": username,
          "message": message,
          "timestamp": timestamp},
         room=channel_name)


@socketio.on("file sent")
def file_sent(data):
    channel_name = data["channel_name"]
    username = data["username"]
    filename = data["filename"]
    link = data["link"]
    timestamp = time.time()
    if channel_name not in messages:
        messages[channel_name] = {
            "users": set(),
            "messages": []
        }
    messages[channel_name]["messages"].append({
        "timestamp": timestamp,
        "username": username,
        "link": link,
        "filename": filename
    })
    if len(messages[channel_name]["messages"]) > MESSAGES_LIMIT:
        messages[channel_name]["messages"] = messages[channel_name]["messages"][-MESSAGES_LIMIT:]
    emit("announce file",
         {"channel_name": channel_name,
          "username": username,
          "timestamp": timestamp,
          "link": link,
          "filename": filename},
         room=channel_name)


if __name__ == "__main__":
    if not app.config["UPLOAD_DIR"]:
        app.config["UPLOAD_DIR"] = "uploads"
    if not os.path.isdir(app.config["UPLOAD_DIR"]):
        os.mkdir(app.config["UPLOAD_DIR"])

    socketio.run(app,
                 host=os.getenv("FLASK_HOST"),
                 port=os.getenv("FLASK_PORT"))
