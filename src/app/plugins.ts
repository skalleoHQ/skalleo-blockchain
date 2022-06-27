/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { MedicalRecordPlugin } from "./plugins/medical_record/medical_record_plugin";

import { HTTPAPIPlugin } from 'lisk-sdk';

// ts-expect-error Unused variable error happens here until at least one module is registered
export const registerPlugins = (app: Application): void => {
    app.registerPlugin(MedicalRecordPlugin);
    app.registerPlugin(MedicalRecordPlugin);
    app.registerPlugin(HTTPAPIPlugin);
};
