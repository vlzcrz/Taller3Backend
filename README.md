Before anything, you must have installed [NodeJS 18.18.0](https://nodejs.org/es) and [MySQL Workbench 8.1.0](https://dev.mysql.com/downloads/mysql/) in your device, also you have to install the sequelize´s CLI, to do this
you have to execute the following commands in the BASH command console:

```bash
	npm install -g sequelize-cli
	npm install
```

### Local testing

After installed all the dependencies copy all key values of .env.template.local to a .env file.
Run 'docker compose up -d' to run mysql container.
Run 'npm run dev' the original owner of this repository made scripts commands capable of triggering tasks for sequelize to seed the db.
