# Pinned teaching snapshot; review base updates deliberately.
FROM python:3.12-alpine@sha256:5789aa194f757888f41fa3d48e14b6feaa1b57c0af0b56fcb1372d6474d3bff0
WORKDIR /app
COPY docker_counter.py /app/docker_counter.py
RUN mkdir /data && chown 10001:10001 /data
USER 10001
EXPOSE 8000
CMD ["python", "-u", "/app/docker_counter.py"]
