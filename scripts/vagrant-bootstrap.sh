#!/bin/bash -e

APP_DB_USER=playlists
APP_DB_PASS=playlists
APP_DB_NAME=playlists

export DEBIAN_FRONTEND=noninteractive

# Update repos and system
apt-get update

# Upgrade system (not really a good idea, as ubuntu/xenial64 is already updated)
# apt-get -y upgrade

# Install Python 3 and virtualenv
apt-get install -y python3 virtualenv

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Install development tools (if for some reason, pip cannot install wheels)
# apt-get install -y build-essential python3-dev libpq-dev

# ----------------
# PostgreSQL Setup
# ----------------

PG_CONF="/etc/postgresql/9.5/main/postgresql.conf"
PG_HBA="/etc/postgresql/9.5/main/pg_hba.conf"
PG_DIR="/var/lib/postgresql/9.5/main"

# Edit postgresql.conf to change listen address to '*':
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

# Append to pg_hba.conf to add password auth:
echo "host    all             all             all                     md5" >> "$PG_HBA"

# Explicitly set default client_encoding
echo "client_encoding = utf8" >> "$PG_CONF"

# Restart so that all new config is loaded:
service postgresql restart

cat << EOF | su - postgres -c psql
-- Create the database user:
CREATE USER $APP_DB_USER WITH PASSWORD '$APP_DB_PASS';

-- Create the database:
CREATE DATABASE $APP_DB_NAME WITH OWNER=$APP_DB_USER
                                  LC_COLLATE='en_US.utf8'
                                  LC_CTYPE='en_US.utf8'
                                  ENCODING='UTF8'
                                  TEMPLATE=template0;
EOF

# ------------------------
# Python Development Setup
# ------------------------

VENV_DIR="/home/ubuntu/venv"

su - ubuntu -c "virtualenv -ppython3 $VENV_DIR"
su - ubuntu -c "$VENV_DIR/bin/pip install -r /vagrant/requirements.txt"
su - ubuntu -c "source $VENV_DIR/bin/activate && /vagrant/manage.py migrate"
su - ubuntu -c "source $VENV_DIR/bin/activate && /vagrant/scripts/populate_db.py"

echo "source $VENV_DIR/bin/activate" >> /home/ubuntu/.bashrc

# Create run-server.sh script

cat << EOF > /home/ubuntu/run-server.sh
#!/bin/bash
source $VENV_DIR/bin/activate
python /vagrant/manage.py runserver 0.0.0.0:8080
EOF
chmod +x /home/ubuntu/run-server.sh

echo "---------------------------------------------------------------"
echo "Database Settings:"
echo "\'NAME\': \'$APP_DB_NAME\'"
echo "\'USER\': \'$APP_DB_USER\'"
echo "\'PASSWORD\': \'$APP_DB_PASS\'"
echo "\'HOST\': \'localhost\'"
echo "\'PORT\': \'\'"
echo "After connecting to machine: vagrant ssh"
echo "...run server with: ./run-server.sh"
echo "---------------------------------------------------------------"
