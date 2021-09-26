FROM python:3.9
RUN pip install --upgrade pip; apk add build-base; pip install numpy
WORKDIR /app
COPY ./backend .
RUN pip install -r requirements.txt
EXPOSE 5000
ENTRYPOINT [ "python" ]
CMD [ "run.py" ]
