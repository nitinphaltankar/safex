import StellarSdk from 'stellar-sdk';
import { AES, enc } from 'crypto-js';
import { getAdmin } from '../routes/admin';

//const ENVCryptoSecret = 'Stellar-is-awesome';
const ENVCryptoSecret = 'ed25519SecretSeed';
//const stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const stellarServer = new StellarSdk.Server('https://horizon.stellar.org/');

const stellarAsset = new StellarSdk.Asset(
    StellarSdk.Asset.native().code,
    'GCOFITSFJHF6AHFUQHC3CXMSBAF7UGX7IA46IOHGBX7WXASMHO4SJKCV'
);
StellarSdk.Network.useTestNetwork();


export const createAccount = async () => {
    return new Promise(async(resolve, reject) => {
        const keypair = StellarSdk.Keypair.random();

        const secret = AES.encrypt(
            keypair.secret(),
            ENVCryptoSecret
        ).toString()

        const data = {
            stellarAddress: keypair.publicKey(),
            stellarSeed: secret
        }

        // Commented for time being NITIN + 24Jan20
        //await createAccountInLedger(keypair.publicKey());
        // Commented for time being NITIN + 24Jan20

        console.log('acc', data);
        resolve(data);
    })
}

export const createAccountInLedger = async (newAccount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const admin = await getAdmin();
            console.log ("//////////////////////");
            console.log (admin);
            console.log ("//////////////////////");

            const provisionerKeyPair = StellarSdk.Keypair.fromSecret(AES.decrypt(admin.stellarSeed, ENVCryptoSecret).toString(enc.Utf8))
            const provisioner = await stellarServer.loadAccount(provisionerKeyPair.publicKey())
            
            // const provisionerKeyPair = StellarSdk.Keypair.fromSecret((admin.stellarSeed+"ed25519SecretSeed").toString(enc.Utf8))
            // const provisioner = await stellarServer.loadAccount(provisionerKeyPair.publicKey())

            // const provisionerKeyPair = StellarSdk.Keypair.fromSecret(admin.stellarSeed)
            // const provisioner = await stellarServer.loadAccount("1415c9ba-45ac-421f-93b6-ef87c441669f")

        
            console.log('creating account in ledger', newAccount)
        
            const transaction = new StellarSdk.TransactionBuilder(provisioner)
                .addOperation(
                    StellarSdk.Operation.createAccount({
                    destination: newAccount,
                    startingBalance: '1'
                })
                ).build()
      
            transaction.sign(provisionerKeyPair)
        
            const result = await stellarServer.submitTransaction(transaction);
            console.log('Account created: ', result)
            resolve(result);
            } catch (e) {
            console.log('Stellar account not created.', e)
        }
    })
}


export const payment = async (signerKeys, destination, amount) => {
  
    const account = await stellarServer.loadAccount(signerKeys.publicKey())
  
    let transaction = new StellarSdk.TransactionBuilder(account)
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount: amount
        })
      )
      .build()
  
    transaction.sign(signerKeys)
  
    console.log(`sending ${amount} from ${signerKeys.publicKey()} to ${destination} `)
    try {
      const result = await stellarServer.submitTransaction(transaction)
      console.log(`sent ${result}`)
      return result
    } catch (e) {
      console.log(`failure ${e}`)
      throw e
    }
  }

export const getAccount = (id) => {
    console.log('called');
    return stellarServer.accounts()
        .accountId(id)
        .call()
        .then((response) => {
            console.log('res', response);
            return response;
        })
        .catch((error) => {
            console.log('error', error);
            throw error
        })
}   