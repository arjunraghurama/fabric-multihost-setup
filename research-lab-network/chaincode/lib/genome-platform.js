/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class GenomePlatform extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const datasets = [
            {
                type: 'FullGenomeSequence',
                permission: 'private',
                size: '20GB',
                owner: 'ResearchLab',
            },
            {   type: 'FullGenomeSequence',
                permission: 'private',
                size: '21GB',
                owner: 'ResearchLab',
            },
            {
                type: 'FullGenomeSequence',
                permission: 'private',
                size: '10GB',
                owner: 'Hospital',
            },
            {
                type: 'FullGenomeSequence',
                permission: 'private',
                size: '6MB',
                owner: 'Pharma Company',
            },
        ];

        for (let i = 0; i < datasets.length; i++) {
            datasets[i].docType = 'dataset';
            await ctx.stub.putState('DATASET' + i, Buffer.from(JSON.stringify(datasets[i])));
            console.info('Added <--> ', datasets[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryDataset(ctx, datasetNumber) {
        const datasetsAsBytes = await ctx.stub.getState(datasetNumber); // get the dataset from chaincode state
        if (!datasetsAsBytes || datasetsAsBytes.length === 0) {
            throw new Error(`${datasetNumber} does not exist`);
        }
        console.log(datasetsAsBytes.toString());
        return datasetsAsBytes.toString();
    }

    async createDataset(ctx, datasetNumber, type, permission, size, owner) {
        console.info('============= START : Create Dataset ===========');

        const dataset = {
            color: size,
            docType: 'dataset',
            make: type,
            model: permission,
            owner,
        };

        await ctx.stub.putState(datasetNumber, Buffer.from(JSON.stringify(dataset)));
        console.info('============= END : Create Dataset ===========');
    }

    async queryAllDatasets(ctx) {
        const startKey = 'DATASET0';
        const endKey = 'DATASET999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeDataOwner(ctx, datasetNumber, newOwner) {
        console.info('============= START : changeDatasetOwner ===========');

        const datasetAsBytes = await ctx.stub.getState(datasetNumber); // get the dataset from chaincode state
        if (!datasetAsBytes || datasetAsBytes.length === 0) {
            throw new Error(`${datasetNumber} does not exist`);
        }
        const dataset = JSON.parse(datasetAsBytes.toString());
        dataset.owner = newOwner;

        await ctx.stub.putState(datasetNumber, Buffer.from(JSON.stringify(dataset)));
        console.info('============= END : changeDatasetOwner ===========');
    }

}

module.exports = GenomePlatform;
