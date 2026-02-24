import { useState } from "react";
import { GameScene } from "@/components/game/GameScene";
import { getStorageUrl } from "@/lib/supabase";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return <GameScene />;
  }

  return (
    <div 
      className="fixed inset-0 bg-white flex items-center justify-center cursor-pointer page-fade-in"
      onClick={() => setStarted(true)}
    >
      {/* Image of Malupiton - positioned on the left */}
      <img 
        src={getStorageUrl("billboard", "Malupiton.png")} 
        alt="Malupiton" 
        className="absolute left-0 bottom-0 w-[500px] h-[500px] object-cover opacity-[0.30]"
      />

      <div className="text-center">
        {/* Fake 404 Error Box */}
        <div className="border border-gray-300 rounded-md px-8 py-6 mb-6 text-left max-w-md">
          <p className="text-gray-800">
            <span className="font-bold">404</span>: NOT_FOUND
          </p>
            <p className="text-gray-600 mt-2">
              Code: <code className="text-red-700 bg-gray-100 px-1 rounded">NOT_FOUND</code>
            </p>
            <p className="text-gray-600 mt-1">
              ID: <code className="text-red-700 bg-gray-100 px-1 rounded">sin1::f82l7-1771894595720-119766dc2407</code>
            </p>
          </div>

          {/* Fake Documentation Link */}
          <button className="border-2 border-blue-400 text-blue-500 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors w-full max-w-md">
            Read our documentation to learn more about this error.
          </button>

          {/* Hidden hint that appears on hover */}
          <p className="text-gray-400 text-lg mt-8 opacity-0 hover:opacity-100 transition-opacity">
            (click anywhere to continue...)
          </p>
        </div>
    </div>
  );
};

export default Index;
