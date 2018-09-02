#!/bin/bash
# Opens virtual environment, so as to refer to the right packages.
source ./venv/bin/activate
pip freeze | grep -v "pkg-resources" > requirements.txt
