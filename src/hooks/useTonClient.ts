'use client';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { CHAIN, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments, TonClient, beginCell, storeStateInit } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { useCallback } from "react";

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: 'testnet' }),
      })
  );
}
// export const useGetSender = () => {
//   const address = useTonAddress();
//   const [tonConnect] = useTonConnectUI();
//   return useCallback((): Sender => {
//     if (!address) {
//       throw new Error("Not connected");
//     }
//     const init = (init: any) => {   
//       const result = init
//         ? beginCell()
//             .store(storeStateInit(init))
//             .endCell()
//             .toBoc({ idx: false })
//             .toString("base64")
//         : undefined;

//       return result;
//     };
//     return {
//       address: Address.parse(address!),
//       async send(args: SenderArguments) {
//         await tonConnect.sendTransaction({
//           validUntil: Date.now() + 5 * 60 * 1000,
//           messages: [
//             {
//               address: args.to.toString(),
//               amount: args.value.toString(),
//               stateInit: init(args.init),
//               payload: args.body
//                 ? args.body.toBoc().toString("base64")
//                 : undefined,
//             },
//           ],
//         });
//       },
//     };
//   }, [address]);
// };
