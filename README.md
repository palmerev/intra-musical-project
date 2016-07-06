# Intramusical

_An application that generates interval identification ear-training exercises for musicians_

### FEATURES
Authenticated users can:
- work through interactive ear-training exercises for a set of basic musical intervals
- play the notes in an interval individually or together
- select an answer or skip the exercise (skipped exercises are tracked separately)
- view their personal results page, with the total number of exercises completed for each interval type
- make their results page either public (anyone who goes to that URL can view it) or private (only visible to them)

### TODOS
- refactor Javascript to a framework?
- Class-based views?
- Django REST Framework?
- Improve styling and user experience
- Add richer analysis of results
- Suggest a new set of exercises based on the user's strengths and weaknesses


#### To Run Locally
Inside a fresh virtual environment with Python 3:

```bash
git clone [CLONE_URL]
cd intra-musical-project
pip3 install -r requirements/local.txt
# settings expect to read from a non-version-controlled file called secrets.json
mv secrets.json.example secrets.json
# setup the database
python3 manage.py makemigrations --settings=ear_training.settings.local
python3 manage.py migrate --settings=ear_training.settings.local
# if ear_training models aren't included for some reason, you can migrate them specifically
python3 manage.py makemigrations ear_training --settings=ear_training.settings.local
python3 manage.py migrate ear_training --settings=ear_training.settings.local
# populate the database with note and interval data
python3 manage.py loaddata notes_fixture.json --settings=ear_training.settings.local
python3 manage.py loaddata base_intervals_fixture.json --settings=ear_training.settings.local
python3 manage.py runserver --settings=ear_training.settings.local
```
- Visit localhost:8000

You will be presented with a login form.
- Submit the form with a blank or invalid login to trigger the registration view
- Choose a username and password
- Login with your username and password, and you should see the interval selection menu
- Select at least two intervals, and click "Build Course"


#### NOTES
- **Login system is insecure and is for demonstration purposes only**
- Web Audio API support varies across browsers (tested on recent versions of Chrome and Firefox)
- This repository was moved into its own repository from the palmerev/django repository.
