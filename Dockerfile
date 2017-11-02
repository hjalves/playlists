# References:
# https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices
# https://runnable.com/blog/9-common-dockerfile-mistakes

FROM ubuntu:16.04

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  python3 \
  python3-venv \
  uwsgi \
  uwsgi-plugin-python3 \
  && rm -rf /var/lib/apt/lists/*

# Copy all our files into the image.
RUN mkdir /app/
WORKDIR /app/
COPY . /app/

# Create environment and install requirements
RUN pyvenv /venv
RUN /venv/bin/pip install -r requirements.txt

# Collect static files
RUN /venv/bin/python manage.py collectstatic --noinput

# uWSGI (http protocol on 8000, uwsgi protocol on 9000)
EXPOSE 8000
EXPOSE 9000

CMD ["/app/scripts/run-production.sh"]
