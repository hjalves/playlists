# Playlists

[![Build Status](https://travis-ci.org/hjalves/playlists.svg?branch=master)](https://travis-ci.org/hjalves/playlists)

Web application to manage users and their favorite songs.

## TODO

This README is a work in progress. Sections missing:
- Features
- Architecture and dependencies
- Configuration
- Testing
- Manual deployment
- Changelog
- License

## Development environment

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

A Python virtual environment (located at `~/venv`), with the project
dependencies installed, is automatically activated as soon as you connect
via ssh (via `.bashrc`). If you prefer to run the development server locally,
install Python 3.4+ (and virtualenv) and execute:

```bash
virtualenv -ppython3 venv       # Create a virtual environment named 'venv'
source venv/bin/activate        # Activate the virtual environment
pip install -r requirements     # Install the project dependencies
./manage.py migrate             # Perform database migrations
./scripts/populate_db.py        # Insert test data in the database
./manage.py runserver           # Run the development server (port 8000)
```

## RESTful API

The API is loosely based on RESTful concepts. Both requests and responses
should be serialized in JSON. Some error responses (with status code != 2xx)
may be sent formatted as HTML. All URI end in slash `/`.

There are Postman collections available at `apitests/collections/*`.

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


## Deployment

### AWS Elastic Beanstalk (PaaS-like)

Step-by-step:

- On project root, run: `eb init -p python3.4 <application_name>`
- Create an environment with: `eb create <environment_name>`
- Deploy project with: `eb deploy`

Note: Only the git committed files (in the HEAD commit) will be deployed.
To deploy files staged in git, use `eb deploy --staged`.

## Frontend

The frontend is built with [React](https://reactjs.org/). To have a working
development environment and to build the production version 
you need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).

### Development environment

- Run `npm install` while in `playlists_frontend/` dir to install the dependencies.
- `npm start` starts a development server

### Deployment

Run `./build-frontend.sh` to build a production version. The resulting
artifact is copied to `www` dir (the script stages the files to git).
