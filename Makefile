default: deep-clean install lint check-licenses build test

install: install-python install-hooks install-node

install-python:
	poetry install

install-hooks:
	poetry run pre-commit install --install-hooks --overwrite

install-node:
	npm ci

build:
	npm run build

lint: lint-node lint-githubactions

lint-node:
	npm run lint

lint-githubactions:
	actionlint

test: build
	npm run test

clean:
	rm -rf coverage
	rm -rf lib
	rm -f tsconfig.tsbuildinfo

deep-clean: clean
	rm -rf .venv
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

check-licenses: check-licenses-node check-licenses-python

check-licenses-node:
	echo "not currently implemented from makefile"
	exit 1

check-licenses-python:
	scripts/check_python_licenses.sh
