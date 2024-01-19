import styles from './page.module.css'
import XDropzone  from '@/components/XDropzone/XDropzone'

export default function Home() {
  return (
    <main className={styles.main}>
      <XDropzone />
    </main>
  )
}
