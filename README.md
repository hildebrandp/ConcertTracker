

docker compose up -d --build


docker build -t schisskiss/concerttracker_frontend .
docker push schisskiss/concerttracker_frontend

docker build -t schisskiss/concerttracker_frontend .
docker push schisskiss/concerttracker_frontend 


Fixes:
- Mobile version setlist
- mobile version stop scroling in background

TODO:
- Settings window
    - Export Database content
    - Delete all Data button
    - DB size info
    - Show software version
    - Show that there is a update
- Live acts view click on event opens event, click on Band opens Band...
- Add participants feature
- Add Stats page