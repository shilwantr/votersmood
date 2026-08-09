import { Suspense } from 'react';
import SearchContent from './SearchContent';
import styles from './page.module.css';

export default function SearchPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Search Results</h1>
      </header>
      <Suspense fallback={<div className={styles.loading}>Loading results...</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
