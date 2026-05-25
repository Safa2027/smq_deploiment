# Django + React Project

## Backend setup

cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver


## Frontend setup

cd frontend

npm install
npm run dev