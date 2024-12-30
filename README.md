Before anything, you must have installed [NodeJS 18.18.0](https://nodejs.org/es) and [MySQL Workbench 8.1.0](https://dev.mysql.com/downloads/mysql/) in your device, also you have to install the sequelize´s CLI, to do this
you have to execute the following commands in the  BASH command console:
```bash
	npm install -g sequelize-cli
	npm install
```
Database

to execute the migrations and seeders you must modified the name of the file  .env.example to .env, then modified the password section with your password from workbench.
Also add a variable that define the secret key for the token.

```bash
	DB_HOST=localhost
	DB_DATABASE=nombre_base_de_datos  //name of the database in workbench
	DB_USER=root
	DB_PASSWORD= //here goes the password
    TOKEN_SECRET=mysecretkey
```

Finally in the bash console, execute the following commands:

```bash
	sequelize db:create
	sequelize db:migrate
	sequelize db:seed:all
```

Now you can run the project with following command in the bash console

```bash
	npm run dev
```