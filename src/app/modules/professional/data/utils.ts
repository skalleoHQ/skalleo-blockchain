import { StateStore } from "lisk-sdk";
import { BaseModuleDataAccess, codec, cryptography } from "lisk-sdk";
import { RegisteredProfessionalAccount, RegisteredProfessionalAccountsSchemaProps } from "../assets/register";


const EMPTY_BUFFER = Buffer.alloc(0);

const VALID_PROFESSIONAL_DOMAIN = ['pro'];

const CHAIN_STATE_PROFESSIONAL_ACCOUNTS = 'professional: registeredProfessionalAccounts'

const registeredProfessionalAccountsSchema = {
    $id: 'skalleo/professional/registeredAccounts',
    type: 'object',
    required: ['registeredProfessionalAccounts'],
    properties: {
        registeredProfessionalAccounts: {
            type: 'array',
            fieldNumber: 1,
            items: {
                type: 'object',
                required: ['id', 'ownerAddress', 'professionalIdentificationNumber', 'areaCode', 'username'],
                properties: {
                    id: {
                        dataType: 'bytes',
                        fieldNumber: 1,
                    },
                    ownerAddress: {
                        dataType: 'bytes',
                        fieldNumber: 2,
                    },
                    professionalIdentificationNumber: {
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
                }
            }
        }
    }
};


const createProfessionalAccount = ({ professionalIdentificationNumber, areaCode, username, ownerAddress, nonce }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce || BigInt(0));

    const seed = Buffer.concat([nonceBuffer, ownerAddress]);
    const id = cryptography.hash(seed);

    return {
        id,
        professionalIdentificationNumber,
        areaCode,
        username,
        ownerAddress,
    };

};


const getAllProfessionalAccounts = async (stateStore: StateStore) => {
    const registeredAccountsBuffer = await stateStore.chain.get(
        CHAIN_STATE_PROFESSIONAL_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode<RegisteredProfessionalAccountsSchemaProps>(
        registeredProfessionalAccountsSchema,
        registeredAccountsBuffer
    );

    return registeredAccounts.registeredProfessionalAccounts;
};


const getAllProfessionalAccountsAsJSON = async (dataAccess: BaseModuleDataAccess) => {
    const registeredAccountsBuffer = await dataAccess.getChainState(
        CHAIN_STATE_PROFESSIONAL_ACCOUNTS
    );

    if (!registeredAccountsBuffer) {
        return [];
    };

    const registeredAccounts = codec.decode<RegisteredProfessionalAccountsSchemaProps>(
        registeredProfessionalAccountsSchema,
        registeredAccountsBuffer
    );

    return codec.toJSON<RegisteredProfessionalAccountsSchemaProps>(registeredProfessionalAccountsSchema, registeredAccounts).registeredProfessionalAccounts;
};


const setAllProfessionalAccounts = async (stateStore: StateStore, professionalAccounts: RegisteredProfessionalAccount[]) => {
    const registeredAccounts = {
        registeredProfessionalAccounts: professionalAccounts.sort((a, b) => a.id.compare(b.id)),
    };

    await stateStore.chain.set(
        CHAIN_STATE_PROFESSIONAL_ACCOUNTS,
        codec.encode(
            registeredProfessionalAccountsSchema,
            registeredAccounts
        )
    )
}





module.exports = {
    EMPTY_BUFFER,
    VALID_PROFESSIONAL_DOMAIN,
    CHAIN_STATE_PROFESSIONAL_ACCOUNTS,
    registeredProfessionalAccountsSchema,
    createProfessionalAccount,
    getAllProfessionalAccounts,
    setAllProfessionalAccounts,
    getAllProfessionalAccountsAsJSON,
    
}