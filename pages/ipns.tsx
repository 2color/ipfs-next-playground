import type { NextPage } from 'next'
import React, { useState, useEffect, useCallback } from 'react'
import styles from '../styles/Peers.module.css'

import { useIPFSContext } from '../context/ipfs'

const IPNS: NextPage = () => {
  const { ipfs, id } = useIPFSContext()
  const [name, setName] = useState<string>('')

  // const getState = useCallback(async () => {
  //   const s = await ipfs.name.pubsub.state()
  //   setState(s)
  // }, [ipfs, setState])

  // https://ipfs.io/ipfs/bafybeicklkqcnlvtiscr2hzkubjwnwjinvskffn4xorqeduft3wq7vm5u4
  // useEffect(() => {
  //   getState()
  // }, [id, getState])

  const updateName = useCallback((e: React.BaseSyntheticEvent) => {
    setName(e.target.value)
  }, [setName]);

  // /ipns/k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8

  return (
    <div className="min-h-min flex-col justify-center px-4">
      <h1>IPNS</h1>
      <input type="text" onChange={updateName} />
    </div>
  )
}

export default IPNS
