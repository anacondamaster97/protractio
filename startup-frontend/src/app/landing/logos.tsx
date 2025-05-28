"use client";

import { LogoCarousel } from "@/components/ui/logo-carousel";
import { Card, CardContent } from "@/components/ui/card";

const demoLogos = [
  { id: 1, name: "PostgreSQL", src: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg" },
  { id: 2, name: "Supabase", src: "https://www.prismui.tech/logo/supabase.svg" },
  { id: 3, name: "DynamoDB", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRagyKUGmUPlxuoOo080cin_TYeW78oeUjJ7w&s" },
  { id: 4, name: "AWS", src: "https://5vo2pguut9.ufs.sh/f/IzAdECdWv58dkIlwcVKgwoZ8mA4YMq9QaHlSN57BtcpfJsIW" },
  { id: 5, name: "GCP", src: "https://static-00.iconduck.com/assets.00/google-cloud-icon-2048x1646-7admxejz.png" },
  { id: 6, name: "MySQL", src: "https://www.svgrepo.com/show/303251/mysql-logo.svg" },
];

function LogoCarouselBasic() {
  return (
    <Card className="w-full mt-36 border-none shadow-none">
      <CardContent className="pt-6">
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            TRUSTED SOFTWARE YOU USE
          </p>
          <h2 className="text-[3.5rem] font-bold tracking-tight leading-none">
            Easy, fast, and secure
          </h2>
        </div>
        <LogoCarousel logos={demoLogos} />
      </CardContent>
    </Card>
  );
}

export { LogoCarouselBasic };
