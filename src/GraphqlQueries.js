import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { loadKeyDecryptData, encrypt, stringToBuf, bufToString, makeKeys, callOnStore } from './encrypt';
import { encode } from 'utf8';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: 'http://localhost:4000/graphql'
});

const GET_USER_INFORMATION = gql`
    query getUser($username: String!) {
        getUser(username: $username) {
            id
            username
            email
            name
            password
        }
    }
`;


const USER_EXISTS = gql`
    query userExists($username: String!) {
        userExists(username: $username) {
            id
            password
        }
    }
`;


const EMAIL_EXISTS = gql`
    query emailExists($email: String!) {
        emailExists(email: $email) {
            id
        }
    }
`;


const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $name: String!, $password: String!) {
        createUser(username: $username, email: $email, name: $name, password: $password) {
            id
        }
    }
`;


export function GetUser(usrname) {
    client
        .query({
            query: GET_USER_INFORMATION,
            variables: { username: usrname },
        })
        .then((response) => console.log(response.data))
        .catch((err) => console.error(err));
}


export function UserExists(usrname) {
    client.query({
        query: USER_EXISTS,
        variables: { username: usrname },
    })
    .then((response) => {
        console.log(response.data);
    })
    .catch((err) => console.error(err));
}


export function Login(usrname, password) {
    client.query({
        query: USER_EXISTS,
        variables: { username: usrname },
    })
    .then((response) => {
        console.log(response.data);
        if (response.data.userExists === null) {
            console.log("User does not exist");
            //Login fails
        } else {
            console.log("User exists");
            //Need to decrypt password here to determine if user exists
            loadKeyDecryptData(usrname, password, response.data.userExists.password);
        }
    })
    .catch((err) => console.error(err));
}


export function EmailExists(mail) {
    client.query({
        query: EMAIL_EXISTS,
        variables: { email: mail },
    })
    .then((response) => console.log(response.data))
    .catch((err) => console.error(err));
}


function createIntPswd(encryptedPswd) {
    let chars = [];
    for (var i = 0; i < encryptedPswd.length; i++) {
        const character = encryptedPswd.charCodeAt(i);
        //console.log(character.toString());
        //console.log(String.fromCharCode(character));
        chars.push(character.toString());
    }
    return chars.join(" ");
}


//Encrypt and store encryption key 
export async function saveAndEncryptUser(usrname, mail, nme, pswd) {
	//var data = await makeData();
	console.log("generated data", pswd);
	var keys = await makeKeys()
	var encrypted = await encrypt(stringToBuf(pswd), keys);
	callOnStore(function (store) {
        store.put({id: 1, keys: keys, encrypted: encrypted});
        const encryptedPswd = bufToString(encrypted);

        console.log("Encrypted: " + encryptedPswd);
        console.log(createIntPswd(encryptedPswd));
        
        //This is where password needs to be stored in the database
        client.mutate({
            mutation: CREATE_USER,
            variables: { username: usrname, email: mail, name: nme, password:  createIntPswd(encryptedPswd) },
        })
        .then((response) => console.log(response.data))
        .catch((err) => console.error(err));
	})
}


//TODO -- Not storing encrypted password in the database
export function CreateUser(usrname, mail, nme, pswd) {
    saveAndEncryptUser(usrname, mail, nme, pswd);
}