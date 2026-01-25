

docker compose up -d --build


docker build -t schisskiss/concerttracker_frontend .
docker push schisskiss/concerttracker_frontend

docker build -t schisskiss/concerttracker_frontend .
docker push schisskiss/concerttracker_frontend 


TODO:
- Settings window
    - Export Database content
    - Delete all Data button
    - DB size info
    - Show software version
    - Show that there is a update
- Add participants feature
- Add Stats page