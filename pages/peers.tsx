import type { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from '../styles/Peers.module.css'

import { useIPFSContext } from '../context/ipfs'

const Peers: NextPage = () => {
  const { ipfs, id } = useIPFSContext()
  const [peers, setPeers] = useState<string[]>()

  const getPeers = useCallback(async () => {
    const peers = await ipfs?.swarm.peers()
    const multiaddrs = peers?.map((p) => p.addr.toString())
    setPeers(multiaddrs)
  }, [ipfs, setPeers])

  useEffect(() => {
    getPeers()
  }, [id, getPeers])

  if (peers?.length === 0) {
    return <>'No peers'</>
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Connected peers ({peers?.length})</h1>
        <pre className={styles.code}>{peers?.join('\n')}</pre>
        <button className="button" onClick={getPeers}>
          Refresh peers
        </button>
      </main>
    </div>
  )
}

export default Peers
