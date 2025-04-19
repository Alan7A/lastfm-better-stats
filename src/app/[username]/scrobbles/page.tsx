import ScrobbleComparison from "@/components/charts/scrobble-comparison";

const ScrobblesPage = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-4">Scrobbles</h2>
      <ScrobbleComparison />
    </div>
  );
};

export default ScrobblesPage;
