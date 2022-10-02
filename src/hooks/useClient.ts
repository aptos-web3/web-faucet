import { useSettingStore } from '@/stores/setting'
import { RestClient, FaucetClient } from '@/utils/account'

function useClient () {
  const store = useSettingStore()
  const { TESTNET_URL, FAUCET_URL } = store.getEndpoint()

  const restClient = new RestClient(TESTNET_URL)
  const faucetClient = new FaucetClient(FAUCET_URL, restClient)

  return {
    restClient,
    faucetClient
  }
}

export default useClient
