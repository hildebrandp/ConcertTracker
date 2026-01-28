

docker compose up -d --build


docker build -t schisskiss/concerttracker_frontend .
docker push schisskiss/concerttracker_frontend

docker build -t schisskiss/concerttracker_backend .
docker push schisskiss/concerttracker_backend


Fixes:
- Mobile version setlist
- mobile version stop scroling in background

TODO:
- Desktop tables next to each other?
- Login
    - Only one user, password in .env
    - Session cookies
- Settings window
    - Export Database content
    - DB size info
    - Show software version
    - Show that there is a update
- Add Stats page