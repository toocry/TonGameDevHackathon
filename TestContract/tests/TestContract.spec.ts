import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { TestContract } from '../contracts/output/test_contract_TestContract';
import '@ton-community/test-utils';

describe('TestContract', () => {
    let blockchain: Blockchain;
    let testContract: SandboxContract<TestContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        testContract = blockchain.openContract(await TestContract.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await testContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: testContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and testContract are ready to use
    });

    it('should set score', async () => {
        const player = await blockchain.treasury('player');
        await testContract.send(
            player.getSender(), 
            {
                value: toNano('0.05')
            }, 
            {
                $$type: 'NewPlayerScore', 
                playerAddress: player.address,
                score: BigInt(100)
            }
            );
        const score = await testContract.getPlayerScore(player.address);
        expect(score).toEqual(BigInt(100));
        
    });
});
