import MediaList from './MediaList';

export default function MediaPage() {
  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20 bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Albums</h2>
            <p className="text-muted-foreground">List of all albums.</p>
          </div>
          <MediaList />
        </div>
      </div>
    </section>
  );
}