import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Showtime } from "@/services/type";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTheatersThunk } from "@/store/slices/theaterSlice";

// Generate dates array with current date and next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const day = date.getDate();
    const dayName = date.getDay();
    
    let dayLabel = "";
    if (i === 0) {
      dayLabel = "Hôm nay";
    } else if (i === 1) {
      dayLabel = "Ngày mai";
    } else {
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      dayLabel = dayNames[dayName];
    }
    
    dates.push({
      date: date,
      day: day,
      label: dayLabel,
      isToday: i === 0
    });
  }
  
  return dates;
};

interface ShowtimeLayoutProps {
  showtimes: Showtime[];
}

export default function ShowtimeLayout({ showtimes }: ShowtimeLayoutProps) {
  const dispatch = useAppDispatch();
  const { theaters, loading: theatersLoading } = useAppSelector((state) => state.theater);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const navigate = useNavigate();
  const dateScrollRef = useRef<HTMLDivElement>(null);
  const theaterScrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = 200;
  const dates = generateDates();

  const scroll = (
    ref: React.RefObject<HTMLDivElement>,
    direction: "left" | "right"
  ) => {
    ref.current?.scrollBy({
      left: direction === "left" ? -scrollByAmount : scrollByAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    dispatch(fetchTheatersThunk());
  }, [dispatch]);

  // Filter showtimes based on selected theater and date
  const filteredShowtimes = useMemo(() => {
    let filtered = showtimes;
    
    // Filter by theater
    if (selectedTheater) {
      filtered = filtered.filter(
        (showtime) => showtime.room?.theater?.brand === selectedTheater
      );
    }
    
    // Filter by selected date
    if (selectedDate >= 0 && selectedDate < dates.length) {
      const selectedDateObj = dates[selectedDate].date;
      
      filtered = filtered.filter((showtime) => {
        if (!showtime.time || !Array.isArray(showtime.time)) return false;
        
        return showtime.time.some((timeSlot) => {
          const showtimeDate = new Date(timeSlot.start);

          // Compare only date parts (year, month, day) using local time
          const selectedYear = selectedDateObj.getFullYear();
          const selectedMonth = selectedDateObj.getMonth();
          const selectedDay = selectedDateObj.getDate();

          const showtimeYear = showtimeDate.getFullYear();
          const showtimeMonth = showtimeDate.getMonth();
          const showtimeDay = showtimeDate.getDate();

          return selectedYear === showtimeYear && 
                 selectedMonth === showtimeMonth && 
                 selectedDay === showtimeDay;
        });
      });
    }
    
    return filtered;
  }, [showtimes, selectedTheater, selectedDate, dates]);

  const goToBookingSelect = (id: string) => {
    navigate(`/booking/select/${id}`);
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      {/* Date Selection */}
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
            {dates.map((dateItem, index) => (
              <Button
                key={index}
                variant={selectedDate === index ? "default" : "outline"}
                onClick={() => setSelectedDate(index)}
                className="h-16 w-16 p-0 flex flex-col items-center justify-center min-w-[64px]"
              >
                <span className="text-lg leading-none">{dateItem.day}</span>
                <span className="text-xs leading-none">{dateItem.label}</span>
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

      {/* Theater Filter */}
      <div className="relative w-full">
        <button
          onClick={() =>
            scroll(theaterScrollRef as React.RefObject<HTMLDivElement>, "left")
          }
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={theaterScrollRef}
          className="overflow-x-auto no-scrollbar w-full"
        >
          <div className="flex gap-4 px-12 py-2 w-max items-center">
            {/* Individual Theater Options */}
            {theaters.map((theater) => (
              <Button
                key={theater.id}
                variant={selectedTheater === theater.brand ? "default" : "outline"}
                onClick={() =>
                  setSelectedTheater(
                    selectedTheater === theater.brand ? null : theater.brand
                  )
                }
                className={`border rounded-lg p-2 w-16 h-16 flex items-center justify-center transition ${
                  selectedTheater === theater.brand
                    ? "bg-primary text-white"
                    : "bg-white"
                }`}
                disabled={theatersLoading}
              >
                <img
                  src={theater.brandLogo || "/fallback-logo.png"}
                  alt={theater.brand}
                  className="max-w-full max-h-full object-contain"
                />
              </Button>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            scroll(theaterScrollRef as React.RefObject<HTMLDivElement>, "right")
          }
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-neutral-800 border rounded-full shadow"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Showtimes */}
      <Accordion type="single" className="w-full" collapsible>
        {filteredShowtimes?.map((st: Showtime) => (
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

      {/* No showtimes message */}
      {filteredShowtimes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {(() => {
              const selectedDateLabel = dates[selectedDate]?.label || '';
              const selectedTheaterName = selectedTheater || '';
              
              if (selectedTheater && selectedDateLabel) {
                return `Không có lịch chiếu cho rạp ${selectedTheaterName} vào ${selectedDateLabel}`;
              } else if (selectedTheater) {
                return `Không có lịch chiếu cho rạp ${selectedTheaterName}`;
              } else if (selectedDateLabel) {
                return `Không có lịch chiếu vào ${selectedDateLabel}`;
              } else {
                return "Không có lịch chiếu nào";
              }
            })()}
          </p>
        </div>
      )}
    </div>
  );
}
