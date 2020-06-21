//Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '7ksmdk6yn2'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`
//https://i47dt68ha7.execute-api.us-east-2.amazonaws.com/dev
export const authConfig = {
  //Create an Auth0 application and copy values from it into this map
  domain: 'dev-4xz4629l.us.auth0.com',               //domain: Auth0 Domain
  clientId: 'Dbxw3KjulDlltklAPqugtvIEHYXVUoTW',   //clientId: Auth0 Client ID
  callbackUrl: 'http://localhost:3000/callback'
}
