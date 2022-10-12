import type { NextPage } from 'next'
import { useCallback, useState } from 'react'
import Link from 'next/link'

import { useIPFSContext } from '../context/ipfs'

const Upload: NextPage = () => {
  const { ipfs } = useIPFSContext()
  const [file, setFile] = useState<File>()
  const [cid, setCid] = useState('')
  // const [selectedFile, setSelectedFile] = useState<ArrayBuffer | string>()
  const [loading, setLoading] = useState(false)

  const handleReadURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }

    setFile(e.target.files[0])
  }

  const addToIPFS = useCallback(async () => {
    try {
      if (!file) {
        return
      }
      setLoading(true)
      const res = await ipfs.add(file, {
        cidVersion: 1,
        preload: false,
      })
      if (res) {
        setCid(res.path)
        setLoading(false)
      }
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }, [file, setCid, setLoading, ipfs])

  const handleCancel = () => {
    // setSelectedFile('')
    setCid('')
  }

  return (
    <>
      <div className="container">
        {!file && (
          <div className="box-drag">
            <input type="file" onChange={handleReadURL} />
            <div className="body">
              <h3>
                <span>Drag and drop</span> a file or <br /> select add Image
              </h3>
            </div>
          </div>
        )}

        {file && (
          <div className="section">
            <div className="box-preview">
              <div className="body">
                <p className="name">
                  {file?.name} (<span>{file?.type}</span>)
                </p>
              </div>
            </div>
            <div className="button-group">
              {cid ? (
                <span>Added CID: {cid}</span>
              ) : (
                // <Link href={`/ipfs/${cid}`} replace>
                //   <a className="button primary">See image</a>
                // </Link>
                <button
                  className="button"
                  onClick={addToIPFS}
                  disabled={loading}
                >
                  Add to IPFS
                </button>
              )}
              <button
                className="button"
                onClick={() => handleCancel()}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .container {
          padding: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .button {
          padding: 0 3rem;
          display: flex;
          height: 65px;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
          margin-left: 0.5rem;
          background-color: black;
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }

        .button.primary {
          background-color: #3080ea;
        }

        .button-group {
          margin-top: 0.5rem;
          display: flex;
          flex-direction: row;
        }

        .box-drag {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 1rem;
          background-color: #f5f9fc;
          border: 1px dashed #91adcd;
          border-radius: 8px;
        }

        .box-drag:hover {
          background-color: #e4eefa;
          border-color: #3080ea;
        }

        .box-drag input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0;
          outline: none;
          cursor: pointer;
        }

        .box-drag .body {
          width: 100%;
          text-align: center;
        }

        .box-drag .body h3 {
          padding: 60px 0;
          color: black;
          font-weight: 300;
        }

        .box-drag .body h3 span {
          color: #3080ea;
          font-weight: bold;
        }

        /* Preview image */
        .section {
          width: 100%;
          max-width: 650px;
        }

        .box-preview {
          width: 100%;
          overflow: hidden;
          background: white;
        }

        .box-preview .header {
          height: 300px;
          border-radius: 8px;
          background-size: cover;
          background-position: center center;
        }

        .box-preview .body {
          padding: 0.5rem;
        }

        .box-preview .body span {
          display: inline-block;
          margin-bottom: 0.5rem;
          padding: 2px 4px;
          color: #a9b1bc;
          font-size: 0.5rem;
          text-transform: uppercase;
        }

        .box-preview .body .name {
          font-size: 0.9rem;
        }
      `}</style>
    </>
  )
}

export default Upload
