import { BaseModuleDataAccess, codec, StateStore, cryptography } from 'lisk-sdk';
import { RegisteredPatientAccount, RegisteredPatientAccountsSchemaProps } from '../assets/register';


const VALID_PATIENT_DOMAIN = ['adh'];


const EMPTY_BUFFER = Buffer.alloc(0);



const registeredPatientAccountsSchema = {
    $id: 'skalleo/patient/registeredAccounts',
    type: 'object',
    required: ['registeredPatientAccounts'],
    properties: {
        registeredPatientAccounts: {
            type: 'array',
            fieldNumber: 1,
            items: {
                type: 'object',
                required: ['id', 'ownerAddress', 'patientIdentificationNumber', 'areaCode', 'username'],
                properties: {
                    id: {
                        dataType: 'bytes',
                        fieldNumber: 1,
                    },
                    ownerAddress: {
                        dataType: 'bytes',
                        fieldNumber: 2,
                    },
                    patientIdentificationNumber: {
                        dataType: 'string',
                        fieldNumber: 3,
                    },
                    areaCode: {
                        dataType: 'string',
                        fieldNumber: 4,
                    },
                    username: {
                        dataType: 'string',
                        fieldNumber: 5,
                    },
                }, 
            },
        },
    },
};


const CHAIN_STATE_PATIENT_ACCOUNTS = 'patient: registeredPatientAccounts';


const createPatientAccount = ({ patientIdentificationNumber, areaCode, username, ownerAddress, nonce }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce || BigInt(0))

    const seed = Buffer.concat([ownerAddress, nonceBuffer]);
    const id = cryptography.hash(seed);

    return {
        id,
        patientIdentificationNumber,
        areaCode,
        username,
        ownerAddress,
    };

};


const getAllPatientAccounts = async (stateStore: StateStore) => {
    const registeredAccountsBuffer = await stateStore.chain.get(
        CHAIN_STATE_PATIENT_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode<RegisteredPatientAccountsSchemaProps>(
        registeredPatientAccountsSchema,
        registeredAccountsBuffer
    );


    return registeredAccounts.registeredPatientAccounts;
};


const getAllPatientAccountsAsJSON = async (dataAccess: BaseModuleDataAccess) => {
    const registeredAccountsBuffer = await dataAccess.getChainState(
        CHAIN_STATE_PATIENT_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode<RegisteredPatientAccountsSchemaProps>(
        registeredPatientAccountsSchema,
        registeredAccountsBuffer
    );


    return codec.toJSON<RegisteredPatientAccountsSchemaProps>(registeredPatientAccountsSchema, registeredAccounts).registeredPatientAccounts;
};


const setAllPatientAccounts = async (stateStore: StateStore, patientAccounts: RegisteredPatientAccount[]) => {
    const registeredAccounts = {
        registeredPatientAccounts: patientAccounts.sort((a, b) => a.id.compare(b.id)),
    };

    await stateStore.chain.set(
        CHAIN_STATE_PATIENT_ACCOUNTS,
        codec.encode(registeredPatientAccountsSchema, registeredAccounts)
    );
};







module.exports = {
    VALID_PATIENT_DOMAIN,
    EMPTY_BUFFER,
    CHAIN_STATE_PATIENT_ACCOUNTS,
    registeredPatientAccountsSchema,
    createPatientAccount,
    getAllPatientAccounts,
    setAllPatientAccounts,
    getAllPatientAccountsAsJSON,
}

