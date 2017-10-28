#!/bin/bash -e

APP_DB_USER=playlists
APP_DB_PASS=playlists
APP_DB_NAME=playlists

export DEBIAN_FRONTEND=noninteractive

# Update repos and system
apt-get update
apt-get -y upgrade

# Install Python and build (development) tools
apt-get install -y build-essential python3-dev virtualenv

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib libpq-dev

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

echo "source $VENV_DIR/bin/activate" >> /home/ubuntu/.bashrc
echo "Run server with: /vagrant/manage.py runserver 0.0.0.0:8080"

# Create run-server.sh script

cat << EOF > /home/ubuntu/run-server.sh
#!/bin/bash
source $VENV_DIR/bin/activate
python /vagrant/manage.py runserver 0.0.0.0:8080
EOF
chmod +x /home/ubuntu/run-server.sh
