import { EncodedTransaction, EncodedTransactionSchemaProps } from "../encode";

const fs_extra = require('fs-extra');
const os = require('os');
const path = require('path');
const { cryptography, codec, db } = require('lisk-sdk');



const DB_KEY_TRANSACTIONS = "professional: transactions";
const TRANSMITCARE_ASSET_ID = 2;


const encodedTransactionSchema = {
    $id: 'professional/encoded/transactions',
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


const getDBInstance = async (dataPath = '~/.lisk/skalleo-app', dbName = 'medicalRecord_plugin.db') => {
    const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/medical_record', dbName);
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
    catch(error) {
        return [];
    }
};


const getAllTransactions = async (db, registeredSchema) => {
    const savedTransactions = await getTransactions(db);
    const transactions: EncodedTransaction[] = [];
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
        if (module.name = 'professional') {
            let dbKey, savedHistory, care, patientHistory, encodedPatientHistory;
            if (trx.assetID === TRANSMITCARE_ASSET_ID) {
                channel.invoke('professional:getAllRecordedCare').then(async (allCare) => {
                    channel.invoke('patient:getAllPatientAccounts').then(async (allPatients) => {
                        for (let i = 0; i < allPatients.length; i++) {
                            for (let j = 0; j < allCare.length; j++) {
                                if (allPatients[i].patientIdentificationNumber === allCare[j].patientIdentificationNumber && 
                                    allPatients[i].reverseLookup === allCare[j].reverseLookup && 
                                    allPatients[i].areaCode === allCare[j].areaCode) {

                                        dbKey = 'patient:${allPatients[i].id}';
                                        savedHistory = await getPatientHistory(db, dbKey);
                                        if (savedHistory && savedHistory.length < 1 ) {
                                            care = allCare[j].careSpecifications;
                                            patientHistory = [care, ...savedHistory];
                                            encodedPatientHistory = codec.encode(encodedPatientHistorySchema, { patientHistory });
                                            await db.put(dbKey, encodedPatientHistory);
                                        }
                                }
                            }
                        }
                    });
                });
            }
        }
    })
    
};


const decodeTransaction = (encodedTransaction: EncodedTransactionSchemaProps, registeredSchema: EncodedTransaction) => {
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


const getTransactionAssetSchema = (transaction, registeredSchema) => {
    const txAssetSchema = registeredSchema.transactionsAssets.find(
    assetSchema =>
      assetSchema.moduleID === transaction.moduleID && assetSchema.assetID === transaction.assetID,
    );
    if (!txAssetSchema) {
        throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `ModuleID: ${transaction.moduleID} AssetID: ${transaction.assetID} is not registered.`);
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






