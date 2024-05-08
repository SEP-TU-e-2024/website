# website

## Installation

### Prerequisites
1. Clone the repository.
2. Open the root folder.
3. Create a `.env` file in the root folder.
4. Add the following environment variables to the `.env` file:
``` properties
## Backend 
SECRET_KEY = "secret_key"
DB_NAME = "benchlab"
DB_HOST = "http://localhost:5432"
DB_USER = "user"
DB_PASSWORD = "password"

DEBUG = "True"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "some-smtp-ip.com"
EMAIL_FROM = "mymail@mail.com"
EMAIL_HOST_USER = "mymail@mail.com"
EMAIL_HOST_PASSWORD = "password"
EMAIL_PORT = "587"
EMAIL_USE_TLS = "True"

FRONTEND_URL = http://localhost:5173/

## Frontend 
VITE_API_URL = "http://localhost:8000/api"
```
<!-- 5. Create a virtual environment for the backend by running `virtualenv .venv` in the root folder. -->

### Frontend
1. Make sure you have **Node.js 20.13.0 LTS** installed on your machine. If not, please install it. **LINUX ONLY**: You might need to use Node Version Manager(NVM) to install this specific verison of Node.js. 
3. Install/Activate yarn (run `corepack enable`, this command might require admin priviliges).
4. Open the frontend folder.
5. Run `yarn` (this will install all dependencies).
6. To start vite you can run `yarn vite`.

### Backend
1. Make sure you have **Python 3.12.3** installed.
2. 

### Folder Structure
```
.root/
├─ .github/
├─ .venv/
├─ backend/
├─ docs/
├─ frontend/
├─ .env
├─ .gitignore
├─ README.md
├─ SECURITY.md
```


## !Use YARN to install dependencies for the frontend!


## Deployment
Use the production branch to deploy the webapp.
