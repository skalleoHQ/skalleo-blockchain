import { BaseModuleDataAccess, codec, cryptography, StateStore } from "lisk-sdk";
import { ARecordedCare, RecordedCareSchemaProps } from "../assets/register";

const EMPTY_BUFFER = Buffer.alloc(0);

const CHAIN_STATE_CARE = 'professional: recordedCare';

const recordedCareSchema = {
    $id: 'skalleo/professional/recordedCare',
    type: 'object',
    required: ['recordedTransmittedCare'],
    properties: {
        recordedCare: {
            type: 'array',
            fieldNumber: 1,
            items: {
                type: 'object',
                required: ['id', 'senderAddress', 'patientIdentificationNumber', 'reverseLookup', 'areaCode', 'careSpecifications'],
                properties: {
                    id: {
                        dataType: 'bytes',
                        fieldNumber: 1,
                    },
                    senderAddress: {
                        dataType: 'bytes',
                        fieldNumber: 2,
                    },
                    patientIdentificationNumber: {
                        dataType: 'string',
                        fieldNumber: 3,
                    },
                    reverseLookup: {
                        dataType: 'string',
                        fieldNumber: 4,
                    },
                    areaCode: {
                        dataType: 'string',
                        fieldNumber: 5,
                    },
                    specifications: {
                        dataType: 'string',
                        fieldNumber: 6,
                    },
                },
            },
        },
    },  
};


const recordCare = ({ patientIdentificationNumber, reverseLookup, areaCode, careSpecifications, senderAddress, nonce }) => {
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigInt64LE(nonce || BigInt(0));

    const seed = Buffer.concat([nonceBuffer, senderAddress]);
    const id = cryptography.hash(seed);

    return {
        id, 
        patientIdentificationNumber,
        reverseLookup,
        areaCode,
        careSpecifications,
        senderAddress
    }
};


const getAllRecordedCare = async (stateStore: StateStore) => {
    const recordedCareBuffer = await stateStore.chain.get(
        CHAIN_STATE_CARE
    );

    if (!recordedCareBuffer) {
        return [];
    };

    const transmittedCare = codec.decode<RecordedCareSchemaProps>(
        recordedCareSchema,
        recordedCareBuffer
    );

    return transmittedCare.recordedCare
    
};


const getAllRecordedCareAsJSON = async (dataAccess: BaseModuleDataAccess) => {
    const recordedCareBuffer = await dataAccess.getChainState(
        CHAIN_STATE_CARE
    );

    if (!recordedCareBuffer) {
        return [];
    };

    const transmittedCare = codec.decode<RecordedCareSchemaProps>(
        recordedCareSchema,
        recordedCareBuffer
    );

    return codec.toJSON<RecordedCareSchemaProps>(recordedCareSchema, transmittedCare).recordedCare;
};


const setAllRecordedCare = async (stateStore: StateStore, transmittedRecordedCare: ARecordedCare[]) => {
    const transmittedCare = {
        recordedCare: transmittedRecordedCare.sort((a, b) => a.id.compare(b.id)), 
    };

    await stateStore.chain.set(
        CHAIN_STATE_CARE,
        codec.encode(
            recordedCareSchema,
            transmittedCare
        )
    )
}






module.exports = {
    recordedCareSchema,
    EMPTY_BUFFER,
    CHAIN_STATE_CARE,
    recordCare,
    getAllRecordedCare,
    getAllRecordedCareAsJSON,
    setAllRecordedCare,
}