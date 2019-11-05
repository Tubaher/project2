web: gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1  --timeout=180 --graceful-timeout=180 --log-level=debug "application:app"
