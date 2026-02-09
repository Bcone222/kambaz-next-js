export default function TailwindFilters() {
  return (
    <div>
      <div>
      <h3 className="text-3xl font-bold mb-4">Blurs</h3>
        <div className="flex">
          <img className="blur-none w-1/4" src="/images/teslabot.jpg" />
          <img className="blur-sm w-1/4" src="/images/teslabot.jpg" />
          <img className="blur-lg w-1/4" src="/images/teslabot.jpg" />
          <img className="blur-2xl w-1/4" src="/images/teslabot.jpg" />
        </div>
      </div>
    </div>
  );
}
