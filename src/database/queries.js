
const accountTableStatusQuery = `
    SELECT *
    FROM pg_catalog.pg_tables
    WHERE schemaname != 'pg_catalog' AND 
        schemaname != 'information_schema';
`;
export { accountTableStatusQuery };


const createAccountTableQuery = `
    CREATE TABLE accounts(
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL
    );
`;
export { createAccountTableQuery };


//Hide password in environment variables
//Password below means nothing
const addAccountQuery = `
    INSERT INTO accounts (username, email, name, password) VALUES(
        'dreese33',
        'dylanjacobreese@gmail.com',
        'Dylan Reese',
        crypt('ThisIsAPassword43!', gen_salt('bf'))
    );
`;
export { addAccountQuery };


const deleteAccountsTable = `
    DROP TABLE accounts;
`;
export { deleteAccountsTable };


const pgcryptoExtension = `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
`;
export { pgcryptoExtension };