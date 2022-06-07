import { codec, cryptography } from 'lisk-sdk';
import { PatientModuleProps } from '../interface';

const VALID_PATIENT_DOMAIN = ['adh'];

const EMPTY_BUFFER = Buffer.alloc(0);

const registeredPatientAccountsSchema = {
    $id: 'patient/registeredAccounts',
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
    nonceBuffer.writeBigInt64LE(nonce);

    const seed = Buffer.concat([patientIdentificationNumber, areaCode, username, ownerAddress, nonceBuffer]);
    const id = cryptography.hash(seed);

    return {
        id,
        patientIdentificationNumber,
        areaCode,
        username,
        ownerAddress,
    };

};


const getAllPatientAccounts = async (stateStore) => {
    const registeredAccountsBuffer = await stateStore.chain.get(
        CHAIN_STATE_PATIENT_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode(
        registeredPatientAccountsSchema,
        registeredAccountsBuffer
    );


    return registeredAccounts.registeredPatientAccounts;
};


const getAllPatientAccountsAsJSON = async (dataAccess) => {
    const registeredAccountsBuffer = await dataAccess.getChainState(
        CHAIN_STATE_PATIENT_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode(
        registeredPatientAccountsSchema,
        registeredAccountsBuffer
    );


    return codec.toJSON(registeredPatientAccountsSchema, registeredAccounts).registeredPatientAccounts;
};


const setAllPatientAccounts = async (stateStore, patientAccounts) => {
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
    registeredPatientAccountsSchema,
    CHAIN_STATE_PATIENT_ACCOUNTS,
    createPatientAccount,
    getAllPatientAccounts,
    setAllPatientAccounts,
    getAllPatientAccountsAsJSON,
}

