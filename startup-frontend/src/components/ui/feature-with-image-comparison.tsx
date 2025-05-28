import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import chat from './chat.png'

function Feature() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }
    
    const percentage = (x / rect.width) * 100;
    setInset(percentage);
  };

  return (
    <div className="w-full">
      <div className="mx-auto">
        <div className="flex flex-col gap-4">
          <div className="mr-auto">
            <Badge>AI Agents</Badge>
          </div>
          <div className="flex gap-2 flex-col mr-auto">
            <h2 className="text-5xl md:text-5xl tracking-tighter lg:max-w-xl font-regular ">
              Something new!
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-zinc-500 dark:text-zinc-400">
              Managing cross-functional teams is hard.
            </p>
          </div>
          <div className="pt-12 w-full">
            <div
              className="relative aspect-video w-full h-full overflow-hidden rounded-2xl select-none"
              onMouseMove={onMouseMove}
              onMouseUp={() => setOnMouseDown(false)}
              onTouchMove={onMouseMove}
              onTouchEnd={() => setOnMouseDown(false)}
            >
              <div
                className="bg-zinc-100 h-full w-1 absolute z-20 top-0 -ml-1 select-none dark:bg-zinc-800"
                style={{
                  left: inset + "%",
                }}
              >
                <button
                  className="bg-zinc-100 rounded hover:scale-110 transition-all w-5 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-2 z-30 cursor-ew-resize flex justify-center items-center dark:bg-zinc-800"
                  onTouchStart={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onMouseDown={(e) => {
                    setOnMouseDown(true);
                    onMouseMove(e);
                  }}
                  onTouchEnd={() => setOnMouseDown(false)}
                  onMouseUp={() => setOnMouseDown(false)}
                >
                  <GripVertical className="h-4 w-4 select-none" />
                </button>
              </div>
              <img
                src="https://5vo2pguut9.ufs.sh/f/IzAdECdWv58d6ezYiNSEyRBm4VQb1lXkPaAx9IirJeLtOHc0"
                alt="feature8"
                loading="eager"
                className="absolute left-0 top-0 z-10 w-full h-full aspect-video rounded-2xl select-none border"
                style={{
                  clipPath: `inset(0 0 ${inset}%)`,
                }}
              />
              <img
                src="https://5vo2pguut9.ufs.sh/f/IzAdECdWv58dvTq9lheHVDAal5R3sqcY0QOmSrJ6fwnbNW2F"
                alt="darkmode-feature8.png"
                loading="eager"
                className="absolute left-0 top-0 w-full h-full aspect-video rounded-2xl select-none border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
