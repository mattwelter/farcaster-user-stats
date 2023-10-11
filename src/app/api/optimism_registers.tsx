import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';

    
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
        if (req.method !== 'GET') {
            return res.status(405).end();
        }
    
        const provider = new JsonRpcProvider(process.env.OPTIMISM_RPC_URL);
        const contractAddress = '0x00000000fc94856F3967b047325F88d47Bc225d0';
        const contractABI = [{"inputs":[{"internalType":"address","name":"_idRegistry","type":"address"},{"internalType":"address","name":"_storageRegistry","type":"address"},{"internalType":"address","name":"_keyRegistry","type":"address"},{"internalType":"address","name":"_trustedCaller","type":"address"},{"internalType":"address","name":"_initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"CallFailed","type":"error"},{"inputs":[],"name":"InvalidAddress","type":"error"},{"inputs":[],"name":"InvalidAmount","type":"error"},{"inputs":[],"name":"OnlyTrustedCaller","type":"error"},{"inputs":[],"name":"Registrable","type":"error"},{"inputs":[],"name":"Seedable","type":"error"},{"inputs":[],"name":"Unauthorized","type":"error"},{"anonymous":false,"inputs":[],"name":"DisableTrustedOnly","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldCaller","type":"address"},{"indexed":true,"internalType":"address","name":"newCaller","type":"address"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"SetTrustedCaller","type":"event"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"acceptOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"disableTrustedOnly","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"idRegistry","outputs":[{"internalType":"contract IdRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"keyRegistry","outputs":[{"internalType":"contract KeyRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"recovery","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"internalType":"struct IBundler.RegistrationParams","name":"registration","type":"tuple"},{"components":[{"internalType":"uint32","name":"keyType","type":"uint32"},{"internalType":"bytes","name":"key","type":"bytes"},{"internalType":"uint8","name":"metadataType","type":"uint8"},{"internalType":"bytes","name":"metadata","type":"bytes"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bytes","name":"sig","type":"bytes"}],"internalType":"struct IBundler.SignerParams[]","name":"signers","type":"tuple[]"},{"internalType":"uint256","name":"storageUnits","type":"uint256"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_trustedCaller","type":"address"}],"name":"setTrustedCaller","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"storageRegistry","outputs":[{"internalType":"contract StorageRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"recovery","type":"address"},{"components":[{"internalType":"uint32","name":"keyType","type":"uint32"},{"internalType":"bytes","name":"key","type":"bytes"},{"internalType":"uint8","name":"metadataType","type":"uint8"},{"internalType":"bytes","name":"metadata","type":"bytes"}],"internalType":"struct IBundler.SignerData[]","name":"signers","type":"tuple[]"},{"internalType":"uint256","name":"units","type":"uint256"}],"internalType":"struct IBundler.UserData[]","name":"users","type":"tuple[]"}],"name":"trustedBatchRegister","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"trustedCaller","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"trustedOnly","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"to","type":"address"},{"internalType":"address","name":"recovery","type":"address"},{"components":[{"internalType":"uint32","name":"keyType","type":"uint32"},{"internalType":"bytes","name":"key","type":"bytes"},{"internalType":"uint8","name":"metadataType","type":"uint8"},{"internalType":"bytes","name":"metadata","type":"bytes"}],"internalType":"struct IBundler.SignerData[]","name":"signers","type":"tuple[]"},{"internalType":"uint256","name":"units","type":"uint256"}],"internalType":"struct IBundler.UserData","name":"user","type":"tuple"}],"name":"trustedRegister","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
        try {
            const currentBlock = await provider.getBlockNumber();
            const currentBlockData = await provider.getBlock(currentBlock);
            const currentBlockTimestamp = currentBlockData?.timestamp || 0;
            
            // Find the block from 24 hours ago by checking blocks' timestamps.
            let fromBlock = currentBlock - (24 * 60 * 4); // Roughly estimated # of blocks in 24 hours
            while (true) {
                const pastBlockData = await provider.getBlock(fromBlock);
                const pastBlockTimestamp = pastBlockData?.timestamp || 0;
                if (pastBlockTimestamp <= currentBlockTimestamp - 24 * 60 * 60) {
                    break;
                }
                fromBlock--;
            }
    
            const registerSignature = ethers.id("Register(address)");
            const filter = {
                fromBlock: fromBlock,
                toBlock: 'latest',
                address: contractAddress,
                topics: [registerSignature]
            };
    
            const logs = await provider.getLogs(filter);
            res.status(200).json({ totalTransactions: logs.length });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch transactions.' });
        }
    }