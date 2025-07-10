import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Film, Ticket } from "lucide-react";

const Home = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="max-w-3xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-primary">Mooyie</span> – Đặt vé xem phim
          </h1>
          <p className="text-lg text-muted-foreground">
            Trải nghiệm nền tảng đặt vé xem phim hiện đại, nhanh chóng và tiện
            lợi.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link to="/movies">
            <Button size="lg" className="gap-2">
              <Film className="w-5 h-5" />
              Xem phim
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="gap-2">
              <Ticket className="w-5 h-5" />
              Bắt đầu
            </Button>
          </Link>
        </div>

        {/* Optional Feature Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <Card>
            <CardContent className="flex flex-col items-center text-center py-6">
              <Film className="w-8 h-8 mb-2 text-primary" />
              <p className="font-semibold">Lịch chiếu đa dạng</p>
              <p className="text-sm text-muted-foreground">
                Cập nhật liên tục các bộ phim hot với khung giờ phong phú.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center text-center py-6">
              <Sparkles className="w-8 h-8 mb-2 text-primary" />
              <p className="font-semibold">Trải nghiệm nhanh chóng</p>
              <p className="text-sm text-muted-foreground">
                Đặt vé chỉ với vài bước đơn giản, giao diện thân thiện.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center text-center py-6">
              <Ticket className="w-8 h-8 mb-2 text-primary" />
              <p className="font-semibold">Ưu đãi hấp dẫn</p>
              <p className="text-sm text-muted-foreground">
                Nhiều khuyến mãi, voucher cho khách hàng thân thiết.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Home;
