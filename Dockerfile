# References:
# https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices
# https://runnable.com/blog/9-common-dockerfile-mistakes

FROM phusion/baseimage:0.9.22

# Use baseimage-docker's init system.
# CMD ["/sbin/my_init", "--enable-insecure-key"]
CMD ["/sbin/my_init"]

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  python3 \
  python3-venv \
  uwsgi \
  uwsgi-plugin-python3 \
  nginx \
  && rm -rf /var/lib/apt/lists/*

# Create environment and install requirements
COPY requirements.txt /tmp/
RUN mkdir /app/ && pyvenv /venv && /venv/bin/pip install -r /tmp/requirements.txt

# Copy all our files into the image.
WORKDIR /app/
COPY . /app/

# Collect static files
RUN /venv/bin/python manage.py collectstatic --noinput

# Enable SSH
# RUN rm -f /etc/service/sshd/down

# Install config files
COPY config/runit/ /etc/service/
COPY config/nginx.conf /etc/nginx/sites-available/default

# Expose NGINX http port
EXPOSE 80
