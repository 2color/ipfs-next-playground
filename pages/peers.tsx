import type { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from '../styles/Peers.module.css'
import { multiaddr } from '@multiformats/multiaddr'

import { useIPFSContext } from '../context/ipfs'

const Peers: NextPage = () => {
  const { ipfs, id } = useIPFSContext()
  const [peers, setPeers] = useState<string[]>([])
  const [peer, setPeer] = useState<string>('')

  const getPeers = useCallback(async () => {
    const peers = await ipfs?.swarm.peers()
    const multiaddrs = peers?.map((p) => p.addr.toString())
    setPeers(multiaddrs)
  }, [ipfs, setPeers])

  useEffect(() => {
    getPeers()
  }, [id, getPeers])

  const updatePeer = useCallback(
    (e: React.BaseSyntheticEvent) => {
      setPeer(e.target.value)
    },
    [setPeer],
  )

  const connectToPeer = useCallback(async () => {
    // console.log(multiaddr(peer))
    await ipfs.swarm.connect(multiaddr(peer))
  }, [setPeer])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connected peers ({peers?.length})</h1>
        {peers.length > 0 && (
          <pre className={styles.code}>{peers?.join('\n')}</pre>
        )}

        <div className="flex flex-row my-2">
          <input
            className="border-2 rounded w-96"
            type="text"
            onChange={updatePeer}
            placeholder="multiaddr"
          />
          <button
            className="mx-2 p-2 border-2 bg-emerald-500 hover:bg-emerald-400 rounded"
            onClick={connectToPeer}
          >
            Connect
          </button>
        </div>
        <button
          className="button p-2 border-2  bg-sky-500 hover:bg-sky-400 rounded hover:background-pink"
          onClick={getPeers}
        >
          Refresh peers
        </button>
      </main>
    </div>
  )
}

export default Peers
