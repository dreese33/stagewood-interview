import pkg from 'pg';
const { Client } = pkg;

import dotenv from 'dotenv';
dotenv.config();

import readline from 'readline';
const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

import { accountTableStatusQuery, createAccountTableQuery, createAuthFunction } from './queries.js';
import { addAccountQuery, deleteAccountsTable, pgcryptoExtension } from './queries.js';
import { createActionTable, createActionDispatcher, createDispatcher, createActionJournalTable } from './queries.js';


const deleteDBStr = 'The table `accounts` already exists, meaning this database is already setup.';
const warning = 'Warning: This operation will result in all database entries being deleted. To recreate the tables, enter `drop-tables`\n';


//Connect to DB
const client = new Client({
    connectionString: process.env.DATABASE,
    ssl: { rejectUnauthorized: false }
});

//Query declarations
let accountTableExists = false;


async function createPgcryptoExtension() {
    client.query(pgcryptoExtension, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}


async function createAccountTable() {
    client.query(createAccountTableQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Account table created");
    });
}


async function addAccount() {
    client.query(addAccountQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Base account added");
        client.end();
    });
}


async function clearDatabase() {
    client.query(deleteAccountsTable, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Accounts dropped");
    });
}


/* Actions begin */
async function createAuthenticationFunction() {
    client.query(createAuthFunction, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}


async function dropAuth() {
    client.query("DROP FUNCTION action_authenticate;", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Auth dropped");
    });
}


async function dropActionTable() {
    client.query("DROP TABLE action;", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Actions table dropped");
    });
}


async function createActionsTable() {
    client.query(createActionTable, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Actions table created");
    });
}


async function createDispatcherTrigger() {
    client.query(createDispatcher, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Dispatch trigger created");
    });
}


async function createDispatcherFunction() {
    client.query(createActionDispatcher, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Dispatch function created");
    });
}


async function makeActionsPublic() {
    client.query("INSERT INTO action VALUES ('authentication');", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Actions public now");
    });
}


async function dropTriggerDispatcher() {
    client.query("DROP TRIGGER dispatcher ON action_journal;", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Dispatcher trigger dropped");
    });
}


async function dropActionJournal() {
    client.query("DROP TABLE action_journal;", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("action_journal dropped");
    });
}


async function createActionJournal() {
    client.query(createActionJournalTable, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("action_journal created");
    });
}


async function dropActions() {
    await dropAuth();
    await dropTriggerDispatcher();
    await dropActionJournal();
    await dropActionTable();
}


async function createActions() {
    await createActionsTable();
    await createActionJournal();
    await createDispatcherFunction();
    await createDispatcherTrigger();
    await createAuthenticationFunction();
    await makeActionsPublic();
}


async function actions() {
    dropActions();
    createActions();
}
/* Actions end */


function recreateAccountTable() {
    read.question(deleteDBStr + '\n' + warning, response => {
        if (response === "drop-tables") {
            console.log("\nClearing database");
            clearDatabase();
            createAccountTable();
            addAccount();
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


async function callQueries() {
    //await actions();   //This function creates public functions on a table called actions for more security - needs more work
    await createPgcryptoExtension();
    testAccountTableExists();
}


const main = async () => {
    await client.connect();
    client.query(accountTableStatusQuery, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        if (res.rowCount > 0) {
            accountTableExists = true;
        }
        callQueries();
    });
};

main();
