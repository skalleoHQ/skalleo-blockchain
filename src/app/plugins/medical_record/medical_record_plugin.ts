import { BasePlugin, codec, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import { ARecordedCare } from '../../modules/professional/assets/register';

const express = require('express');
const cors = require('cors');


const { getDBInstance,
		getPatientHistory,
		getAllTransactions,
		savePatientHistory,
		saveTransactions,

} = require('../medical_record/data/utils');

 /* eslint-disable class-methods-use-this */
 /* eslint-disable  @typescript-eslint/no-empty-function */
export class MedicalRecordPlugin extends BasePlugin {
	// private _channel!: BaseChannel;
	_server;
	_app;
	_channel!: BaseChannel;
	_db;
	_nodeInfo;



	public static get alias(): string {
		return 'medicalRecord';
	};


	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'moussa',
			version: '0.1.0',
			name: 'medicalRecord',
		};
	};


	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-medicalRecord/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		}
	};


	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	};


	public get actions(): ActionsDefinition {
		return {
		// 	hello: async () => { hello: 'world' },
		};
	};
	

	public async load(channel: BaseChannel): Promise<void> {
		this._app = express();
		this._channel = channel;
		this._db = await getDBInstance();
		this._nodeInfo = await this._channel.invoke('app:getNodeInfo');
		

		this._app.use(cors({origin: '*', methods: ['GET', 'POST', 'PUT'] }));
		this._app.use(express.join());


		this._app.get('/api/recorded_care', async (req, res) => {// req is never used
			const recordedCare: ARecordedCare[] = await this._channel.invoke('professional:getAllRecordedCare');
			const data = await Promise.all(recordedCare.map(async care => {
				const dbKey = '${care.id}';
				let patientHistory = await getPatientHistory(this._db, dbKey);
				patientHistory = patientHistory.map(h => h.toString('binary'));

				return {
					...care,
					patientHistory,
				}
			}));
			
			res.join({ data });
		});


		this._app.get('/api/recorded_care/:patientIdentificationNumber', async (req, res) => {
			const recordedCare: ARecordedCare[] = await this._channel.invoke('professional:getAllRecordedCare');
			const care = recordedCare.find((t) => t.patientIdentificationNumber === req.params.patientIdentificationNumber);
			const dbKey = '${care.id}';
			let patientHistory = await getPatientHistory(this._db, dbKey);
			patientHistory = patientHistory.map(h => h.toString('binary'));

			res.join({ data: { ...care, patientHistory } });
		});


		this._app.get("/api/transactions", async (_req, res) => {
			const transactions = await getAllTransactions(this._db, this.schemas);
	  
			const data = transactions.map(trx => {
			  	const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
			  	const asset = module.transactionAssets.find(a => a.id === trx.assetID);
			  	return {
					...trx,
					...trx.asset,
					moduleName: module.name,
					assetName: asset.name,
			  	}
			})
			res.json({ data });
		});
	  
		this._subscribeToChannel();
	  
		this._server = this._app.listen(8080, "0.0.0.0");
	};


	_subscribeToChannel() {
		// listen to application events and enrich blockchain data for UI/third party application
		this._channel.subscribe('app:block:new', async (data: any) => {
			const { block } = data;
			const { payload } = codec.decode(
			  	this.schemas.block,
			  	Buffer.from(block, 'hex'),
			);

			if (payload.length > 0) {
				await saveTransactions(this._db, payload);
				const decodedBlock = this.codec.decodeBlock(block);

				// save Patient transaction history
				await savePatientHistory(this._db, decodedBlock, this._nodeInfo.registeredModules, this._channel);
			}
		});
	};


	async unload() {
		// close http server
		await new Promise<void>((resolve, reject) => {
			this._server.close((err) => {
				if (err) {
					reject(err);
					return;
				}
			resolve();
			});
		});
		// close database connection
		await this._db.close();
		}
	};
	


module.exports = {
	MedicalRecordPlugin,
}


