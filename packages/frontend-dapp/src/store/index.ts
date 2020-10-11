import { config } from "../utils/Config";

import Onboard from "bnc-onboard";
import { API as OnboardApi, Wallet } from "bnc-onboard/dist/src/interfaces";
import Notify from "bnc-notify";
// Ethers
import ethers from "ethers";

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ethers: null,
    provider: null,
    signer: null,
    account: null,
    userAddress: null,
    currentNetwork: null,
    notify: null,
    onboard: null,
    wallet: null
  },
  mutations: {
    setSigner(state, signer) {
      state.signer = signer;
      console.log("signer set to: ", state.signer);
    },
    setUserAddress(state, address) {
      state.userAddress = address;
      console.log("user address set to:");
      console.log(state.userAddress);
    },
    setCurrentNetwork(state, network) {
      state.currentNetwork = network;
      console.log("network set to: " + state.currentNetwork);
    },
    setEthers(state, ethers) {
      state.ethers = ethers;
      console.log("ethers set to: ", state.ethers);
    },
    setProvider(state, provider) {
      state.provider = provider;
      console.log("provider set to: ", state.provider);
    },

    setOnboard(state, onboard) {
      state.onboard = onboard;
      console.log("onboard set to: ");
      console.log(state.onboard);
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
      console.log("wallet set to: ");
      console.log(state.wallet);
    }
  },
  actions: {
    async setUp({ dispatch, state }) {
      console.log("IN SETUP");
      // Setting up Onboard.js
      // await setUpOnboard();
      await dispatch("setUpOnboard");

      // Setting up the Smart contracts
      await dispatch("setUpContracts");
    },

    async setUpOnboard({ commit, state }) {
      console.log("Onboard.js flow...");
      const SUPPORTED_NETWORK_IDS: number[] = [1, 42];

      const onboardInstance = Onboard({
        dappId: config(state.currentNetwork).onboardConfig.apiKey,
        hideBranding: true,
        networkId: 1, // Default to main net. If on a different network will change with the subscription.
        subscriptions: {
          address: (address: string | null) => {
            commit("setUserAddress", address);
          },
          network: async (networkId: any) => {
            if (!SUPPORTED_NETWORK_IDS.includes(networkId)) {
              alert("This dApp will work only with the Mainnet or Kovan network");
            }
            state.onboard?.config({ networkId: networkId });
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
              const ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
              commit("setProvider", ethersProvider);
              commit("setNetwork", await ethersProvider.getNetwork());
            } else {
              commit("setProvider", null);
              commit("setNetwork", null);
            }
          }
        },
        walletSelect: config(state.currentNetwork).onboardConfig.onboardWalletSelect,
        walletCheck: config(state.currentNetwork).onboardConfig.walletCheck
      });

      await onboardInstance.walletSelect();
      await onboardInstance.walletCheck();
      commit("setOnboard", onboardInstance);

      console.log("> Successfully run onboard.js");
    },

    async setUpContracts({ commit, state }) {
      console.log("Setting up Smart Contract instances...");
      //   // Setting up contract info
      //   let tokensAddress = await ContractHelper.getTokenAddress(state.currentNetwork);
      //   commit(mutations.SET_CONTRACT_ADDRESS, tokensAddress.unique);
      //   commit(mutations.SET_MOCK_CONTRACT_ADDRESS, tokensAddress.mock);
      //   // Getting the contract instance
      //   let tokenContractInstance = await ContractHelper.getContractInstance(
      //     state.tokenInfo.tokenContractAddress,
      //     state.ethers,
      //     state.signer,
      //     UniqueUserTokensABI.abi
      //   );
      //   commit(mutations.SET_CONTRACT_INSTANCE, tokenContractInstance);

      //   let mockInstance = await ContractHelper.getContractInstance(
      //     state.mockToken.mockContractAddress,
      //     state.ethers,
      //     state.signer,
      //     MockTokenABI.abi
      //   );
      //   commit(mutations.SET_MOCK_CONTRACT_INSTANCE, mockInstance);

      //   console.log("> Successfully set up Smart Contract instances");
    }

    // LOADING ACTIONS

    /**
     * @notice Pulls all the posts from the ThreadDB and adds any posts that the
     * state does not currently have.
     */
  },
  modules: {}
});
