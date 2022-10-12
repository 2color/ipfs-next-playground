import type { NextPage } from 'next'
import { useState, useEffect, useCallback } from 'react'
import styles from '../styles/Peers.module.css'

import { useIPFSContext } from '../context/ipfs'

const IPNS: NextPage = () => {
  const { ipfs, id } = useIPFSContext()
  const [state, setState] = useState<any>()

  const getState = useCallback(async () => {
    const s = await ipfs.name.pubsub.state()
    setState(s)
  }, [ipfs, setState])

  // https://ipfs.io/ipfs/bafybeicklkqcnlvtiscr2hzkubjwnwjinvskffn4xorqeduft3wq7vm5u4
  useEffect(() => {
    getState()
  }, [id])

  // /ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8

  return (
    <div className="min-h-min flex-col justify-center px-4">
      <h1>IPNS</h1>
    </div>
  )
}

export default IPNS

// min-height: 100vh;
// /* padding: 4rem 0; */
// flex: 1;
// display: flex;
// flex-direction: column;
// justify-content: center;
// align-items: center;
