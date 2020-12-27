
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


//These queries below are useless unless database password authentication works


const createAuthFunction = `
    CREATE OR REPLACE FUNCTION action_authenticate(usr text, pwd text)
    RETURNS boolean
    AS
    $$
    BEGIN
        RETURN EXISTS(
            SELECT name FROM accounts WHERE username=usr AND password = crypt(pwd, password));
    END;
    $$
    LANGUAGE plpgsql VOLATILE;
`;
export { createAuthFunction };


const createActionTable = `
    CREATE TABLE action(
        id_ TEXT NOT NULL PRIMARY KEY
    );
`;
export { createActionTable };


const createActionJournalTable = `
    CREATE TABLE action_journal(
        id_ bigserial primary key,
        ts_ timestamp not null default now(),
        user_id_ text not null,
        action_id_ text not null references action(id_),
        request_ jsonb not null,
        response_ jsonb
    );
`;
export { createActionJournalTable };


const createActionDispatcher = `
    CREATE OR REPLACE FUNCTION action_dispatcher_trigger() 
    RETURNS trigger AS $BODY$
    DECLARE
        response jsonb;
    BEGIN
        EXECUTE 'SELECT action_' || NEW.action_id_ || '($1, $2, $3)' 
            INTO response
            USING NEW.id_, NEW.user_id_, NEW.request_;
        NEW.response_ = response;
        RETURN NEW;
    END;
    $BODY$
    LANGUAGE plpgsql VOLATILE;
`;
export { createActionDispatcher };


const createDispatcher = `
    CREATE TRIGGER dispatcher
    BEFORE INSERT
    ON action_journal
    FOR EACH ROW
    EXECUTE PROCEDURE action_dispatcher_trigger();
`;
export { createDispatcher };