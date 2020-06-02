# eustisdev

### Execution:

Test locally:
firebase serve --only functions,hosting

Prod:
firebase deploy

### Development:

#### TODO

- Get general structure for webpage. maybe 'business card' index.html - more about me\* - there's probably an interesting way to do this - frontend 'playground' - CV/ML 'playground' - CV/Resume section

##### FRONTEND

- Redo index
- Make a 404 page
- Add visit counter as entry modal
- three.js stuff
- zzz.dog stuff

#### BACKEND

- Delay loading of certain firestore connections _cough_ visitRef _cough_ - sidenote figure out why the databse call for visitRef is 30s ???
- use my brain to think about what I need to be storing in my database
- pay our Google overlords more money so i get less stall time on pageload: - [https://stackoverflow.com/questions/29206067/understanding-chrome-network-log-stalled-state](https://stackoverflow.com/questions/29206067/understanding-chrome-network-log-stalled-state) - also make sure to pretend that I'm going to implement sharding so that queueing becomes a non-issue

#### DATA ![heart eyes](https://i.pinimg.com/originals/f4/bf/92/f4bf92d41c99d853914f703e968647cd.png =25x25)

- RL Mouse movement (a)
- transformer TTS [https://github.com/as-ideas/TransformerTTS](https://github.com/as-ideas/TransformerTTS)
- BiT + DETR (lmao good luck running this in a browser) - choose 1: - money that i dont have to spend on an AWS V100 - users that can load my webpage in under 2 days - replacing BiT with like mobilenet and shrinking DETR so attention dot products aren't expensive https://arxiv.org/pdf/2002.04764.pdf or https://www.youtube.com/watch?v=q7QP_lfqnQM
-

#### DONE

- convert from .toml netlify academic hugo garbage to a CLEAN and CRISP deployment structure with firebase
- track mouse data to eventually train (a) :)
- track user visits
- google analytics
- make sure my firebase key wasn't leaked whoops :)
- page caching for faster local visits - which is only going to matter once more than one (1) person visits my webpage (me).
- I bet Tim is gonna read these at some point. hey Tim :)
