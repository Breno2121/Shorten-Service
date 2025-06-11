'use client'
import axios from "axios";
import styles from "./page.module.css";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [originalLink, setOriginalLink] = useState<string>('')
  const [isCustomize, setIsCustomize] = useState<boolean>(false)
  const [linkCustomize, setLinkCustomize] = useState<string>('')
  const [shortLink, setShortLink] = useState<string>('')
  const [base64, setBase64] = useState<string>('')

  function handleValue(value: boolean) {
    setIsCustomize(value)
    setLinkCustomize('')
  }

  async function handleSubmit() {
    const shortId = isCustomize && !!linkCustomize ? linkCustomize : null;


    const body = {
      url: originalLink,
      shortId: shortId
    }

    const response = await axios.post("http://localhost:3333/shorten", body)
    setShortLink(`http://localhost:3000/${response.data.shortId}`)
  }

  async function handleSubmitQrCode() {
    const body = {
      url:originalLink
    }
    const response = await axios.post("http://localhost:3333/qr-code", body)
    setBase64(response.data.base64)
  }


  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Encurtador de Link</h1>
        <input type="text" placeholder="Cole o link..." value={originalLink}
          onChange={(e) => setOriginalLink(e.target.value)}
        />

        <div className={styles.customizeLinke}>
          <span>Customizar URL:</span>
          <input type="checkbox" checked={isCustomize} onChange={(e) => handleValue(e.target.checked)} />
          <input type="text" placeholder="Link customizado..."
            value={linkCustomize}
            onChange={(e) => setLinkCustomize(e.target.value)}
            disabled={!isCustomize}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit}>Encurtar Link</button>
          <button onClick={handleSubmitQrCode}>Gerar QRCode</button>
        </div>

        <div className={styles.content}>
          <h1>LINK CURTO</h1>
          {!!base64 && <img src={base64} />
          }

        </div>

      </div>
    </div>
  );
}
