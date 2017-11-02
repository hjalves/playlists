# References:
# https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices
# https://runnable.com/blog/9-common-dockerfile-mistakes

FROM phusion/baseimage:0.9.22

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  python3 \
  python3-venv \
  uwsgi \
  uwsgi-plugin-python3 \
  nginx \
  && rm -rf /var/lib/apt/lists/*

# Create application root directory
RUN mkdir /app/

# Create environment and install requirements
COPY requirements.txt /app/requirements.txt
RUN pyvenv /venv
RUN /venv/bin/pip install -r /app/requirements.txt

# Copy all our files into the image.
WORKDIR /app/
COPY . /app/

# Collect static files
RUN /venv/bin/python manage.py collectstatic --noinput

# Enable SSH
RUN rm -f /etc/service/sshd/down

# Install runit services
RUN mkdir /etc/service/uwsgi
COPY config/runit-uwsgi.sh /etc/service/uwsgi/run
RUN chmod +x /etc/service/uwsgi/run

RUN mkdir /etc/service/nginx
COPY config/runit-nginx.sh /etc/service/nginx/run
RUN chmod +x /etc/service/nginx/run

COPY config/nginx.conf /etc/nginx/sites-available/default

# Expose NGINX http port
EXPOSE 80
