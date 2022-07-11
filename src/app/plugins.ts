/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';

import { MedicalRecordPlugin } from "./plugins/medical_record/medical_record_plugin";

import { DashboardPlugin } from '@liskhq/lisk-framework-dashboard-plugin';
//import { FaucetPlugin } from '@liskhq/lisk-framework-faucet-plugin';

// ts-expect-error Unused variable error happens here until at least one module is registered
export const registerPlugins = (app: Application): void => {
    app.registerPlugin(MedicalRecordPlugin);
    app.registerPlugin(DashboardPlugin);
    //app.registerPlugin(FaucetPlugin);
};
