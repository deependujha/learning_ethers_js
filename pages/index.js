import React from 'react';
import { ethers } from 'ethers';

const index = () => {
	const btnClick = async () => {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			await provider.send('eth_requestAccounts', []);
			const { chainId } = await provider.getNetwork();
			console.log('chain id is: ', chainId);

			const myChainId = 137; // Polygon Mainnet
			let val = ethers.utils.hexStripZeros(myChainId);

			if (myChainId !== chainId) {
				try {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: val }],
					});
				} catch (err) {
					// This error code indicates that the chain has not been added to MetaMask
					if (err.code === 4902) {
						await window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [
								{
									chainName: 'Polygon Mainnet',
									chainId: ethers.utils.hexStripZeros(myChainId),
									nativeCurrency: {
										name: 'MATIC',
										decimals: 18,
										symbol: 'MATIC',
									},
									rpcUrls: ['https://polygon-rpc.com/'],
								},
							],
						});
					}
				}
			}

			const signer = provider.getSigner();
			const againChain = await signer.getChainId();
			const usrAddr = await signer.getAddress();
			const bal = await signer.getBalance();
			console.log('chain is: ', againChain);
			console.log('address is: ', usrAddr);
			console.log('balance is: ', bal);
		} else {
			console.log('please install metamask');
		}
	};

	const sendEth = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		await provider.send('eth_requestAccounts', []);
		const signer = await provider.getSigner();
		// Send 1 ether to an ens name.
		signer
			.sendTransaction({
				to: '0x31B0F3eeD8cAFA7D09C862b7779AAc826F3c4468',
				value: ethers.utils.parseEther('0.05'),
			})
			.then(async(tx) => {
				console.log('tx occurred: ', tx);
        let receipt = await tx.wait()
        console.log("receipt is: ", receipt);

			})
			.catch((err) => {
				console.log('error occurred: ', err);
			});
	};

	return (
		<div>
			<button onClick={btnClick}>Click me</button>
			<button onClick={sendEth}>Send ether</button>
		</div>
	);
};

export default index;
