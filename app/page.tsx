import dynamic from 'next/dynamic';

const SortingVisualizer = dynamic(() => import('@/components/SortingVisualizer'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <SortingVisualizer />
    </main>
  );
}