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

### Some Known Issues
- **NOTE**: Login system is insecure and is for demonstration purposes only
- Audio for playing both notes in an interval could be improved with Tone.js polysynth instead of overlapping notes
- Web Audio API support varies across browsers (tested on recent versions of Chrome and Firefox)

**NOTE**: This repository was moved into its own repository from the palmerev/django repository.
