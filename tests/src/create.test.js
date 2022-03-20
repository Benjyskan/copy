import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, nano_models, SPECULOS_ADDRESS, txFromEtherscan, resolutionConfig, loadConfig } from './test.fixture';
import ledgerService from "@ledgerhq/hw-app-eth/lib/services/ledger"
import { ethers } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

// EDIT THIS: Replace with your contract address
const contractAddr = "0x9a065e500cdcd01c0a506b0eb1a8b060b0ce1379";
// EDIT THIS: Replace `boilerplate` with your plugin name
const pluginName = "nested";
const abi_path = `../${pluginName}/abis/` + contractAddr + '.json';
const abi = require(abi_path);

//test
const iface = new ethers.utils.Interface(abi)
console.log(iface)
const data2 = '0xa378534b000000000000000000000000000000000000000000000000000000000000263b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020466c6174000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000dbd2fc137a30000'
const resu = iface.decodeFunctionData('create', data2)
console.log("RESU:", resu)
//test

// Test from replayed transaction: https://etherscan.io/tx/0x0160b3aec12fd08e6be0040616c7c38248efb4413168a3372fc4d2db0e5961bb
// EDIT THIS: build your own test
// nano_models.forEach(function (model) {
//   test('[Nano ' + model.letter + '] Swap Exact Eth For Tokens with beneficiary', zemu(model, async (sim, eth) => {

//     // The rawTx of the tx up above is accessible through: https://etherscan.io/getRawTx?tx=0xb27a69cd3190ad0712da39f6b809ecc019ecbc319d3c17169853270226d18a8a
//     const serializedTx = txFromEtherscan("0x02f872011d8459682f00850d6ceb2e6b8252089472fcd630fd6c5e8e5e320027d11bae75d0498db887d529ae9e86000080c001a0050528d91325913b438e683052de760494cadcd12e10f0be5bec11dd41607c4da07ee026906580b8231420b9292224b78f158607a701073101247d278d51963fa9");

//     const tx = eth.signTransaction(
//       "44'/60'/0'/0",
//       serializedTx,
//     );

//     const right_clicks = model.letter === 'S' ? 12 : 6;

//     // Wait for the application to actually load and parse the transaction
//     await waitForAppScreen(sim);
//     // Navigate the display by pressing the right button `right_clicks` times, then pressing both buttons to accept the transaction.
//     await sim.navigateAndCompareSnapshots('.', model.name + '_swap_exact_eth_for_tokens_with_beneficiary', [right_clicks, 0]);

//     await tx;
//   }));
// });

// Test from constructed transaction
// EDIT THIS: build your own test
nano_models.forEach(function (model) {
  test('[Nano ' + model.letter + '] create plz', zemu(model, async (sim, eth) => {
    const contract = new ethers.Contract(contractAddr, abi);

    // Constants used to create the transaction
    // EDIT THIS: Remove what you don't need
    // const amountOutMin = parseUnits("28471151959593036279", 'wei');
    // const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    // const SUSHI = "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2";
    // const path = [WETH, SUSHI];
    // const deadline = Number(1632843280);



    // We set beneficiary to the default address of the emulator, so it maches sender address
    const beneficiary = SPECULOS_ADDRESS;

    // EDIT THIS: adapt the signature to your method
    // signature: swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    // EDIT THIS: don't call `swapExactETHForTokens` but your own method and adapt the arguments.
    // const { data } = await contract.populateTransaction.swapExactETHForTokens(amountOutMin, path, beneficiary, deadline);

    // Get the generic transaction template
    let unsignedTx = genericTx;
    // Modify `to` to make it interact with the contract
    unsignedTx.to = contractAddr;
    // Modify the attached data
    //https://polygonscan.com/tx/0x14297c32a09294e73649d27fb986ad4f433bbd3117ba48f5c2a97f68927dc627
    // unsignedTx.data = "0xa378534b0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020466c6174000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000000232bff5f46c000";
    //https://polygonscan.com/tx/0x151ca1f23334e538569082822b5fa2877c266b4d7219609d6c46dc30a6c20747
    unsignedTx.data = "0xa378534b000000000000000000000000000000000000000000000000000000000000263b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020466c6174000000000000000000000000000000000000000000000000000000000000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf1270000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000d500b1d8e8ef31e21c99d1db9a6444d3adf12700000000000000000000000000000000000000000000000000dbd2fc137a30000";
    // EDIT THIS: get rid of this if you don't wish to modify the `value` field.
    // Modify the number of ETH sent
    unsignedTx.value = parseEther("1");

    // Create serializedTx and remove the "0x" prefix
    const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);
    console.log("SERIALIZED:", serializedTx)

    const resolution = await ledgerService.resolveTransaction(
      serializedTx,
      loadConfig,
      resolutionConfig
    );

    console.log("resolution", resolution)

    const tx = eth.signTransaction(
      "44'/60'/0'/0",
      serializedTx,
      resolution
    );

    const right_clicks = model.letter === 'S' ? 7 : 5;

    // Wait for the application to actually load and parse the transaction
    await waitForAppScreen(sim);
    // Navigate the display by pressing the right button 10 times, then pressing both buttons to accept the transaction.
    // EDIT THIS: modify `10` to fix the number of screens you are expecting to navigate through.
    await sim.navigateAndCompareSnapshots('.', model.name + '_create', [right_clicks, 0]);

    await tx;
  }));
});

