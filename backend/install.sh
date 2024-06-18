#!/bin/bash

set -e

echo "-- Setting up Django migrations & fixture"
python3.11 manage.py migrate
python3.11 manage.py loaddata 0001_initial.json

echo "-- All done"
