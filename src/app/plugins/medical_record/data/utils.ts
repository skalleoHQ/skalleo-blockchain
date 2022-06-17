const fs_extra = require("fs-extra");
const os = require("os");
const path = require("path");

import { cryptography, codec, db } from "lisk-sdk";


const DB_KEY_TRANSACTIONS = "patient:transactions";
const TRANSMITCARE_ASSET_ID = 2;


const encodedTransactionSchema = {
    $id: 'patient/encoded/transactions',
    type: 'object',
    required: ['transactions'],
    properties: {
        transactions: {
            type: 'array',
            fieldNumber: 1,
            items: {
                dataType: 'bytes',
            },
        },
    },
};


const encodedPatientHistorySchema = {
    $id: 'patient/encoded/patientHistory',
    type: 'object',
    required: ['patientHistory'],
    properties: {
        patientHistory: {
            type: 'array',
            fieldNumber: 1,
            items: {
                dataType: 'bytes',
            },
        },
    },
};


const getDBInstance = async (dataPath = '~/.skalleo-app/', dbName = 'medical_record_plugin.db') => {
    const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
    await fs_extra.ensureDir(dirPath);
    return new db.KVStore(dirPath);
};


const saveTransactions = async (db, payload) => {
    const savedTransactions = await getTransactions(db);
    const transactions = [...savedTransactions, ...payload];
    const encodedTransactions = codec.encode(encodedTransactionSchema, { transactions });
    await db.put(DB_KEY_TRANSACTIONS, encodedTransactions);
};


const getTransactions = async (db) => {
    try {
        const encodedTransactions = await db.get(DB_KEY_TRANSACTIONS);
        const { transactions } = codec.decode(encodedTransactionSchema, encodedTransactions);
        return transactions;
    }
    catch (error) {
        return [];
    }
};


const getAllTransactions = async (db, registeredSchema) => {
    const savedTransactions = await getTransactions(db);
    const transactions = [];
    for (const trx of savedTransactions) {
        transactions.push(decodeTransaction(trx, registeredSchema));
    }
    return transactions;
};


const getPatientHistory = async (db, dbKey) => {
    try {
        const encodedPatientHistory = await db.get(dbKey);
        const { patientHistory } = codec.decode(encodedPatientHistorySchema, encodedPatientHistory);

        return patientHistory;
    }
    catch (error) {
        return [];
    }
};


const savePatientHistory = async (db, decodedBlock, registeredModules, channel) => {
    decodedBlock.payload.map(async trx => {
        const module = registeredModules.find(m => m.id === trx.moduleID);
        if (module.name === 'patient') {
            let dbKey, savedHistory, base32Address, patientHistory, encodedPatientHistory;
            if (trx.assetID === TRANSMITCARE_ASSET_ID) {
                channel.invoke('patient:getAllPatientAccounts').then(async (val) => {
                    for (let i = 0; i < val.length; i++) {
                        const senderAddress = cryptography.getAddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'));
                        if (val[i].ownerAddress === senderAddress.toString('hex')) {
                            dbKey = 'patient:${val[i].id}';
                            savedHistory = await getPatientHistory(db, dbKey);
                            if (savedHistory && savedHistory.length < 1) {
                                base32Address = cryptography.getBase32AddressFromPublicKey(Buffer.from(trx.senderPublicKey, 'hex'), 'lsk');
                                patientHistory = [Buffer.from(base32Address, 'binary') ,...savedHistory];
                                encodedPatientHistory = codec.encode(encodedPatientHistorySchema, { patientHistory });
                                await db.put(dbKey, encodedPatientHistory);
                            }

                        }
                    }
                })
            }
        }
    });

};


const decodeTransaction = (
    encodedTransaction, 
    registeredSchema
) => {
    const transaction = codec.decode(registeredSchema.transaction, encodedTransaction);
    const assetSchema = getTransactionAssetSchema(transaction, registeredSchema);
    const asset = codec.decode(assetSchema, transaction.asset);
    const id = cryptography.hash(encodedTransaction);
    
    return {
        ...codec.toJSON(registeredSchema.transaction, transaction),
        asset: codec.toJSON(assetSchema, asset),
        id: id.toString('hex'),
    };
};


const getTransactionAssetSchema = (
    transaction,
    registeredSchema
) => {
    const txAssetSchema = registeredSchema.transactionAssets.find(
        assetSchema =>
            assetSchema.moduleID === transaction.moduleID && assetSchema.assetID === transaction.assetID,
    );
    if (!txAssetSchema) {
        throw new Error('ModuleID: ${transaction.moduleID} AssetID: ${transaction.assetID} is not registered.');
    }

    return txAssetSchema.schema;
};



module.exports = {
    getDBInstance,
    getAllTransactions,
    getTransactions,
    saveTransactions,
    savePatientHistory,
    getPatientHistory,
  }












