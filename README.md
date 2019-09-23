SolidPlan
=========

[![Build Status](https://travis-ci.org/SolidPlan/SolidPlan.png?branch=master)](https://travis-ci.org/SolidPlan/SolidPlan)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/SolidPlan/SolidPlan/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/SolidPlan/SolidPlan/?branch=master)

Open-Source Project management tool

SolidPlan is an open-source application to manages simple projects and tasks. 

Requirements
------------

SolidPlan requires minimum PHP 7.1.3 and NodeJs 10.

*Note:* The latest version of PHP is always recommended

## Installation

### Docker

Docker makes it really easy to get started as quickly as possible in running SolidPlan.

To get started with docker, simple run the following command:

```bash
$ docker-compose up
```

Docker will build and run the necessary images. When everything is done, SolidPlan is available at http://127.0.0.1:8085.

**Note:** A default user will be created when building the images for the first time. In order to log in, use the following credentials:

Username: test@example.com
Password: Test1234

### From source

SolidPlan have 2 distinct operations to run. The API and the UI. The API uses PHP (built on Symfony and ApiPlatform) and the UI is built using NuxtJS (Including VuetifyJs for the theme).
In order to run SolidPlan, both parts needs to be set up and run.

To install from source, you first need to clone the repository. To clone the repository, issue the following command

```bash
$ git clone https://github.com/SolidPlan/SolidPlan.git
```

Then go into the repository directory

```bash
$ cd SolidPlan
```

#### API

If you don't already have composer available, follow the instructions at [https://getcomposer.org/download/](https://getcomposer.org/download/)

To install the required dependencies, run the following command:

```bash
$ composer install
```

Once the dependencies is installed, you need to set up a database and run the migrations.
Follow the steps at [https://symfony.com/doc/current/doctrine.html#configuring-the-database](https://symfony.com/doc/current/doctrine.html#configuring-the-database) to configure your database.
When the database configuration is set, run the following commands to create the database (if it doesn't exist yet) and to run the migrations:

```bash
$ php bin/console doctrine:database:create
$ php bin/console doctrine:migrations:migrate
```

Once the database is set up and the schema is created, the API server needs to be started. The best way to do this, is to use the Symfony CLI which includes a local webserver.
Follow the instructions at [https://symfony.com/download](https://symfony.com/download) to download the CLI.
Once you have the CLI installed, run the following command to start the local webserver for the API:

```bash
$ symfony server:start -d
```

Take note of the URL that the is displayed, as you will need this for the following step.

#### UI

For this step, you need to have NodeJs installed with either NPM or Yarn available.

```bash
$ npm install

# or

$ yarn
```

To run the UI, you need to set an environment variable that points to your API server endpoint and compile and run the UI:

```bash
$  export API_PROXY_URL=http://127.0.0.1:8000 # Or whatever the url is that your API server is running on

# then  run one of the following commands:

$ npm run prod

# or

$ yarn run prod
```

When the build process is done, you can open [http://127.0.0.1:3000](http://127.0.0.1:3000) and log in using the user you created in the previous steps.

Features
--------

Some of the basic features included in SolidPlan is:

* Create and manage projects
* Create tasks and add tasks to projects
* Assign tasks to users
* Add labels to tasks and manage global labels
* RESTful API

Contributing
------------

See [CONTRIBUTING](CONTRIBUTING.md)

License
------------

SolidPlan is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)

Please see the [LICENSE](LICENSE) file for the full license.
