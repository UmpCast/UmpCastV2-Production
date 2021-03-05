FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY Pipfile Pipfile.lock /code/
RUN pip install pipenv
RUN pipenv install --system --deploy --ignore-pipfile
COPY . /code/
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]