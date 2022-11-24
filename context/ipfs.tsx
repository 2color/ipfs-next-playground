import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import type { IPFS } from 'ipfs-core-types'
import { IDResult } from 'ipfs-core-types/src/root'
import styles from '../styles/Peers.module.css'
import { multiaddr } from '@multiformats/multiaddr'

import { create } from 'ipfs-core'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { all, dnsWsOrWss } from '@libp2p/websockets/filters'

interface IPFSContextInterface {
  ipfs: IPFS
  id?: IDResult
}
export const IPFSContext = createContext<IPFSContextInterface>({
  id: undefined,
  // @ts-ignore to avoid having to check ipfs isn't undefined everywhere. Can't be undefined because children are conditionally rendered
  ipfs: undefined,
})

interface WrapperProps {
  children?: ReactNode
}

export function AppWrapper({ children }: WrapperProps) {
  const [id, setId] = useState<IDResult>()
  const [ipfs, setIpfs] = useState<IPFS>()

  useEffect(() => {
    const init = async () => {
      if (ipfs) return

      localStorage.debug = 'ipfs:*,libp2p*,-*:trace'

      try {
        // debugger
        const node = await create({
          EXPERIMENTAL: {
            ipnsPubsub: true,
          },
          config: {
            Bootstrap: [],
            Addresses: {
              Delegates: [],
              Swarm: [],
            },
          },
          libp2p: {
            transports: [
              // This should only be enabled in local development!
              // In a production environment the default filter should be used
              // where only DNS + WSS addresses will be dialed by websockets in the browser.
              webSockets({
                filter: dnsWsOrWss,
              }),
              webTransport(),
            ],
            connectionManager: {
              autoDial: false,
            },
          },
        })
        // @ts-ignore
        window.ipfs = node

        // @ts-ignore
        setIpfs(node)

        const nodeId = await node.id()

        // 👇 fails on first byte:
        // libp2p:dialer:error dial to /dns4/my-ipfs-node.fly.dev/tcp/443/wss/p2p/12D3KooWPoeXx9R2woU8jonCSHuGok4CFzM3wBKkZXg2ARnFDwnS failed +0ms Error: stream ended before 1 bytes became available
        const addr = multiaddr(`/dns4/my-ipfs-node.fly.dev/tcp/443/wss/p2p/12D3KooWPoeXx9R2woU8jonCSHuGok4CFzM3wBKkZXg2ARnFDwnS`)

        // 👇
        // const addr = multiaddr(
          // `/ip4/168.220.93.39/udp/4003/quic/webtransport/certhash/uEiD-3ARyU0rj69dpv3bc7qxe3Df6A3fdanAvgEgJ3nXZpQ/certhash/uEiCPruwEkBZAeoB3nUnclF-7BWxcc3A3HvIuk0y59MZRmg/p2p/12D3KooWPoeXx9R2woU8jonCSHuGok4CFzM3wBKkZXg2ARnFDwnS`,
        // )



        await node.swarm.connect(addr)

        setId(nodeId)
      } catch (e) {
        console.error('failed to start IPFS', e)
      }
    }

    init()
  }, [ipfs])

  if (!ipfs) {
    return (
      <>
        <div className={styles.main}>
          <h2>Initializing IPFS node...</h2>
        </div>
      </>
    )
  }

  return (
    <IPFSContext.Provider value={{ id, ipfs }}>{children}</IPFSContext.Provider>
  )
}

export function useIPFSContext() {
  return useContext(IPFSContext)
}
