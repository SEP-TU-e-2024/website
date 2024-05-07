## This is an example of how the .env file should look on your machine

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