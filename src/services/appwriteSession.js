import { Client, Account } from 'appwrite'

const appwriteClient = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("666df32a000334919ac3");

const appwriteAccount = new Account(appwriteClient);

export { appwriteAccount, appwriteClient};