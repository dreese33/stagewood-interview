import pkg from 'pg';
const { Client } = pkg;

import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const deleteDBStr = 'The table `accounts` already exists, meaning this database is already setup.';
const warning = 'Warning: This operation will result in all database entries being deleted. To recreate the tables, enter `drop-database`';


//Connect to DB
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
await client.connect();


//Query declarations
let accountTableExists = false;
const accountTableStatusQuery = `
    SELECT *
    FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog' AND 
        schemaname != 'information_schema';
`;

const createAccountTableQuery = `
    CREATE TABLE accounts(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL
    );
`;

const addAccountQuery = `
    INSERT INTO accounts (username, email, name, password) VALUES(
        'dreese33',
        'dylanjacobreese@gmail.com',
        'Dylan Reese',
        crypt('ThisIsAPassword43!', gen_salt('bf'))
    );
`;

const deleteAccountsTable = `
    DROP TABLE accounts;
`;

const pgcryptoExtension = `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
`;


function createPgcryptoExtension() {
    client.query(pgcryptoExtension, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Pgcrypto working")
    });
}


function createAccountTable() {
    client.query(createAccountTableQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Account table created");
    });
}


function addAccount() {
    client.query(addAccountQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Base account added");
        client.end();
    });
}


function dropAccounts() {
    client.query(deleteAccountsTable, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Accounts dropped");
    });
}


function recreateAccountTable() {
    read.question(deleteDBStr + '\n' + warning, response => {
        if (response === "drop-database") {
            console.log("Dropping accounts");
            dropAccounts();
            createAccountTable();
            addAccount();
        } else {
            client.end();
        }
        read.close();
    });
}


function testAccountTableExists() {
    if (accountTableExists) {
        recreateAccountTable();
    } else {
        console.log("Does not exist");
        createAccountTable();
        addAccount();
    }
}

client.query(accountTableStatusQuery, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    if (res.rowCount > 0) {
        accountTableExists = true;
    }
    createPgcryptoExtension();
    testAccountTableExists();
});
