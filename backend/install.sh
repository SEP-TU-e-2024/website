#!/bin/bash

set -e

# Install Python and dependencies
echo "-- Installing Python and dependencies"
apt-get update
apt-get install -y software-properties-common wget
add-apt-repository -y ppa:deadsnakes/ppa
apt-get update
apt-get install -y python3.11 python3.11-venv
wget https://bootstrap.pypa.io/get-pip.py -O get-pip.py
python3.11 get-pip.py

python3.11 -m pip install -r requirements.txt

apt-get install -y pkg-config default-libmysqlclient-dev build-essential

echo "-- Loading Django migrations & fixture"
python3.11 manage.py migrate
python3.11 manage.py loaddata 0001_initial.json

echo "-- All done"
