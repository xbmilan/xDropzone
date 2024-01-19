import styles from './page.module.css'
import { XDropzone } from '@/components'

export default function Home() {
  return (
    <main className={styles.main}>
      <XDropzone />
    </main>
  )
}
