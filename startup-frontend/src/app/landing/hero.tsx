import { Waves } from "@/components/ui/waves-background"
import { TypeAnimation } from 'react-type-animation';

export function Hero() {
  return (
    <div className="relative w-full bg-background/80 rounded-lg overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <Waves
          lineColor={"rgba(0, 0, 0, 0.3)"}
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto min-h-screen pt-[25vh]">
        <div>
          <h3 className="text-8xl font-bold pb-4">Protractio.</h3>
          <TypeAnimation
            sequence={[
              'Making AI Agents for Marketing',
              2000,
              'Making AI Agents for Data Engineers',
              2000,
              'Making AI Agents for Researchers',
              2000,
              'Making AI Agents for Sales',
              2000,
              'Making AI Agents for Analytics Experts',
              2000,
            ]}
            wrapper="p"
            speed={50}
            className="text-muted-foreground text-4xl"
            repeat={Infinity}
          />
        </div>
      </div>
    </div>
  )
}

