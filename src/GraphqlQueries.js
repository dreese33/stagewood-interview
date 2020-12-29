import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { encrypt, 
    stringToBuf, 
    bufToString, 
    makeKeys, 
    callOnStore,
    parseIntPswd,
    decrypt,
    cleanStr } from './encrypt';


export const client = new ApolloClient({
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
            profile
        }
    }
`;


export const USER_EXISTS = gql`
    query userExists($username: String!) {
        userExists(username: $username) {
            id
            password
        }
    }
`;


export const EMAIL_EXISTS = gql`
    query emailExists($email: String!) {
        emailExists(email: $email) {
            id
        }
    }
`;


const CREATE_USER = gql`
    mutation createUser($username: String!, $email: String!, $name: String!, $password: String!, $profile: String!) {
        createUser(username: $username, email: $email, name: $name, password: $password, profile: $profile) {
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
        .then((response) => {
            console.log(response.data);
            const getUser = response.data.getUser;
            AuthenticateUser(usrname, getUser.email, getUser.name, getUser.profile);
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


function createIntPswd(encryptedPswd) {
    let chars = [];
    for (var i = 0; i < encryptedPswd.length; i++) {
        const character = encryptedPswd.charCodeAt(i);
        chars.push(character.toString());
    }
    return chars.join(" ");
}


async function checkPassword(encrypted, keys, str, username, password) {
    try {
        var data = await decrypt(encrypted, keys);
        console.log(data);
        str = bufToString(data).toString().trim();
        
        let cleanString = cleanStr(str);
        console.log(cleanString);
        if (password === cleanString) {
            //Here we need to get user from database
            GetUser(username);
            console.log("Authentication succeeded");
        } else {
            console.log("Authentication failed, passwords do not match");
        }
    } catch (error) {
        console.log("Authentication failed");
    }
}


//Loads most recently stored password data and authenticates user
export function loadKeyDecryptData(username, password, dbPswd) {
	callOnStore(function (store) {
		var getData = store.get(1);
		var str = '';
    	getData.onsuccess = async function() {
			var keys = getData.result.keys;
			
			var encrypted = stringToBuf(parseIntPswd(dbPswd));
			console.log(encrypted);

			checkPassword(encrypted, keys, str, username, password);
		};
	})
}


//Encrypt and store encryption key and user data
export async function CreateUser(usrname, mail, nme, pswd, uri) {
	var keys = await makeKeys()
	var encrypted = await encrypt(stringToBuf(pswd), keys);
	callOnStore(function (store) {
        store.put({id: 1, keys: keys, encrypted: encrypted});
        const encryptedPswd = bufToString(encrypted);

        console.log("Encrypted: " + encryptedPswd);
        console.log("Uri" + uri);
        
        //This is where password needs to be stored in the database
        client.mutate({
            mutation: CREATE_USER,
            variables: { username: usrname, email: mail, name: nme, password:  createIntPswd(encryptedPswd), profile: uri },
        })
        .then((response) => {
            console.log(response.data);
            AuthenticateUser(usrname, mail, nme, uri);
        })
        .catch((err) => console.error(err));
	})
}


export function AuthenticateUser(username, email, name, profile) {
    //TODO -- token can be set by anyone in the console!
    localStorage.setItem('token', username);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('profile', profile);

    window.location.href = "./home";
}


export function clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('profile');
}