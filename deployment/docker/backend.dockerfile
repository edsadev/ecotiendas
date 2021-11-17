FROM python:3.9
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip; apk add build-base; pip install numpy
COPY ./backend .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD [ "python", "run.py" ]
