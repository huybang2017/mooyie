import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Showtime } from "@/services/type";
import { useNavigate } from "react-router-dom";

const dates = ["Hôm nay", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN", "Thứ 2"];

// const showtimes = [
//   {
//     theater: "CGV Aeon Bình Tân",
//     address: "Tầng 3, Aeon Mall Bình Tân, Số 1 đường số 17A, TP.HCM",
//     roomType: "2D Phụ đề",
//     times: [
//       { start: "17:10", end: "19:01" },
//       { start: "18:20", end: "20:11" },
//       { start: "19:20", end: "21:11" },
//       { start: "20:40", end: "22:31" },
//       { start: "21:30", end: "23:21" },
//       { start: "22:50", end: "00:41" },
//     ],
//   },
//   {
//     theater: "CGV Aeon Tân Phú",
//     address: "Lầu 3, Aeon Mall Tân Phú, TP.HCM",
//     roomType: "2D Phụ đề",
//     times: [
//       { start: "18:00", end: "20:00" },
//       { start: "21:00", end: "23:00" },
//     ],
//   },
// ];

interface ShowtimeLayoutProps {
  showtimes: Showtime[];
}
export default function ShowtimeLayout({ showtimes }: ShowtimeLayoutProps) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const navigate = useNavigate();
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const brandScrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = 200;

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    ref.current?.scrollBy({
      left: direction === "left" ? -scrollByAmount : scrollByAmount,
      behavior: "smooth",
    });
  };

  const brands = useMemo(() => {
    const uniqueMap = new Map<string, { brand: string; logo?: string }>();
    showtimes.forEach((st) => {
      const brand = st.room?.theater?.brand;
      const logo = st.room?.theater?.brandLogo;
      if (brand && !uniqueMap.has(brand)) {
        uniqueMap.set(brand, { brand, logo });
      }
    });
    return Array.from(uniqueMap.values());
  }, [showtimes]);

  // const filteredShowtimes = useMemo(() => {
  //   if (!selectedBrand) return showtimes;
  //   return showtimes.filter((st) => st.room?.theater?.brand === selectedBrand);
  // }, [showtimes, selectedBrand]);
  const goToBookingSelect = (id: string) => {
    navigate(`/booking/select/${id}`); // chuyển đến trang chi tiết phim có id = 123
  };
  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div className="relative w-full">
        <button
          onClick={() =>
            scroll(dateScrollRef as React.RefObject<HTMLDivElement>, "left")
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={dateScrollRef}
          className="overflow-x-auto no-scrollbar w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-2 justify-start px-12 py-2 w-max">
            {dates.map((d, index) => (
              <Button
                key={d}
                variant={selectedDate === index ? "default" : "outline"}
                onClick={() => setSelectedDate(index)}
                className="h-16 w-16 p-0 flex flex-col items-center justify-center min-w-[64px]"
              >
                <span className="text-lg leading-none">{index + 1}</span>
                <span className="text-xs leading-none">{d}</span>
              </Button>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            scroll(dateScrollRef as React.RefObject<HTMLDivElement>, "right")
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="relative w-full">
        <button
          onClick={() =>
            scroll(brandScrollRef as React.RefObject<HTMLDivElement>, "left")
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={brandScrollRef}
          className="overflow-x-auto no-scrollbar w-full"
        >
          <div className="flex gap-4 px-12 py-2 w-max items-center">
            {brands.map((b) => (
              <button
                key={b.brand}
                onClick={() =>
                  setSelectedBrand((prev) =>
                    prev === b.brand ? null : b.brand
                  )
                }
                className={`border rounded-lg p-2 w-16 h-16 flex items-center justify-center transition ${
                  selectedBrand === b.brand
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
              >
                <img
                  src={b.logo || "/fallback-logo.png"}
                  alt={b.brand}
                  className="max-w-full max-h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            scroll(brandScrollRef as React.RefObject<HTMLDivElement>, "right")
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <Accordion type="single" className="w-full" collapsible>
        {showtimes?.map((st: Showtime) => (
          <AccordionItem key={st.id} value={`item-${st.id}`}>
            <AccordionTrigger className="text-left">
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold">
                  {st.room?.theater?.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {st.room?.theater?.location}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 space-y-2">
              {/* <Badge variant="secondary" className="text-sm">
                {st.room?.name}
              </Badge> */}
              <div className="flex flex-wrap gap-2">
                {Array.isArray(st.time) &&
                  st.time.map((t, i) => (
                    <Button
                      onClick={() => goToBookingSelect(st.id)}
                      key={i}
                      variant="outline"
                      size="sm"
                    >
                      {new Date(t.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ~{" "}
                      {new Date(t.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Button>
                  ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
