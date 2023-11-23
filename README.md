[![Node.js CI](https://github.com/TheMineWay/mangas-api/actions/workflows/tests.yml/badge.svg)](https://github.com/TheMineWay/mangas-api/actions/workflows/tests.yml)

# Mangas API

An Open Source API that provides a standard way to query for mangas from different manga readers.

# 0. Booting the project

## 0.0. Setup project files

First of all, you need to clone this repository on the desired machine. You can do this by running:

```shell
git clone https://github.com/TheMineWay/mangas-api.git
```

Then, you will find a file named _example.env_, you need to make a copy of this file and name it **.env**. This file will contain the app settings.
Once you have the _.env_ file created, modify the contents of this file.

You **have** to provide values for the **PORT** and **API_KEYS** variables.

- **PORT**: expects a number. It muct be an available and valid port.
- **API_KEYS**: expects a JSON array of strings. The strings represent the API keys that can be used to interact with this server. There is no limit of API keys. Example: `["supersecretapikey_1","supersecretapikey_2"]`

## 0.1. Execute the project

### 0.1.0 Execute using Docker 🐳

You need to have **Docker Engine** installed. If you don't have it you can follow the official [setup guide](https://docs.docker.com/engine/install/).

Having the Docker Engine installed, you can setup and start the container by running:

```shell
docker compose up
```

There are two _docker-compose.yml_ files, one for development (_docker-compose-dev.yml_) and another for production (_docker-compose.yml_). By default the _docker compose_ command will use the production one.

# 1. Endpoints documentation

You can check the Open API of the server by settings to `true` the **OPEN_API_DOCS** variable on the [.env](./.env) file. Once the project is recompiled you will find in **http://machine-ip-address:port/documentation** an interactive endpoints list.
