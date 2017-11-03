# Playlists

[![Build Status](https://travis-ci.org/hjalves/playlists.svg?branch=master)](https://travis-ci.org/hjalves/playlists)

Web application to manage users and their favorite songs.


## TODO

This README is a work in progress. Sections missing:
- Project organization
- Configuration


## Features

- Manage users (with e-mail and name) and songs (title, artist, album)
- Organize users' favorite songs
- Web interface and RESTful API

### Demo instance

The following server is automatically deployed from the master branch:

> https://playlists-app.herokuapp.com

## Deployment

### Docker

Note: This method uses link which is a deprecated way of connecting containers.

```bash
# Run PostgreSQL instance
docker run --name postgres-pl -d postgres:9.6

# Run application (frontend + backend)
docker run --link postgres-pl:postgres -p 8080:80 -d hjalves/playlists:latest
```

### Frontend build script

Run `scripts/build-frontend.sh` to build a production version. The resulting
artifact is copied to `www` dir (the script stages the files to git).

### AWS Elastic Beanstalk (PaaS-like)

Step-by-step:

- On project root, run: `eb init -p python3.4 <application_name>`
- Create an environment with: `eb create <environment_name>`
- Deploy project with: `eb deploy`

Note: Only the git committed files (in the HEAD commit) will be deployed.
To deploy files staged in git, use `eb deploy --staged`.


You should now have the application running at 
[http://localhost:8080](http://localhost:8080).


## Architecture and dependencies

This application is composed into two main components:

- **Backend**: Replies to HTTP requests (via RESTful API) and performs database
queries. It's built with Python (3.4+), Django and Django REST Framework.
It assumes an existing PostgreSQL instance (but it should work nicely
with other engines, at least SQLite).

- **Frontend**: User interface. It's a single-page application (SPA) 
coded in web technologies, more specifically ECMAScript 6, React, Bootstrap
and axios. It's located on [playlists_frontend/](playlists_frontend/).


## Development environment

### Backend (Python)

To setup a development environment, clone the repository,
install [Vagrant](https://www.vagrantup.com/),
and run `vagrant up`, at the project root directory.

The default Vagrant setup installs a PostgreSQL server with a sample database
at: `postgresql://playlists:playlists@localhost:5432/playlists`.
If you have a Postgres instance already running on your machine, please change
the forwarded port `host: 5432` in `Vagrantfile`, or remove it altogether.

After the VM is up and running, connect it with `vagrant ssh` and:

- `~/run-server.sh`: to run the Django development server at port 8080
- `/vagrant/manage.py` to perform other management activities.

A Python virtual environment (located at `~/venv`, with the project
dependencies installed) is automatically activated as soon as you connect
via ssh (via `.bashrc`). If you prefer running the development server locally,
install Python 3.4+ (and virtualenv) and execute:

```bash
virtualenv -ppython3 venv       # Create a virtual environment named 'venv'
source venv/bin/activate        # Activate the virtual environment
pip install -r requirements     # Install the project dependencies
./manage.py migrate             # Perform database migrations
./scripts/populate_db.py        # Insert test data in the database
./manage.py runserver           # Run the development server (port 8000)
```

### Frontend (Web)

The frontend is built with [React](https://reactjs.org/). To have a working
development environment and to build the production version 
you need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
At the moment, the Vagrant provided does not include the required frontend
tools.

- In a console prompt (with npm available), run `cd playlists_frontend/`
- Run `npm install` to install the dependencies
- `npm start` starts a development server


## Testing

To run the backend tests, activate the virtual environment (see previously)
and run `./manage.py test`.

Frontend does not have any tests.


## RESTful API

The API is loosely based on RESTful concepts. Both requests and responses
should be serialized and expected in JSON format. Some error responses
(with status code ≠ 2xx) may be sent as HTML. All URI end in slash `/`.

There are Postman collections available at
[apitests/collections/](apitests/collections/).

### Endpoints

| Method | URI                       | Description                        |
| ------ |:--------------------------|:-----------------------------------|
| GET    | /api/v1/songs/            | List songs                         |
| POST   | /api/v1/songs/            | Add a song                         |
| GET    | /api/v1/songs/:id/        | View song details                  |
| PUT    | /api/v1/songs/:id/        | Update song                        |
| PATCH  | /api/v1/songs/:id/        | Partially update song              |
| DELETE | /api/v1/songs/:id/        | Delete song                        |
| GET    | /api/v1/users/            | List users                         |
| POST   | /api/v1/users/            | Add an user                        |
| GET    | /api/v1/users/:id/        | View user details                  |
| PUT    | /api/v1/users/:id/        | Update user                        |
| PATCH  | /api/v1/users/:id/        | Partially update user              |
| DELETE | /api/v1/users/:id/        | Delete user                        |
| GET    | /api/v1/users/:id/songs/  | Get user's favorite songs          |
| POST   | /api/v1/users/:id/songs/  | Add favorite songs to an user      |
| PUT    | /api/v1/users/:id/songs/  | Replace user's favorite songs      |
| DELETE | /api/v1/users/:id/songs/  | Remove favorite songs from an user |


## FAQ

#### Why is this even useful? 

This project was given to me as an exercise. 

## License

MIT

