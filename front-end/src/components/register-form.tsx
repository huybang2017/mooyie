import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      })
    );

    if (register.fulfilled.match(result)) {
      toast.success("Đăng ký thành công!");
      navigate("/");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Tạo tài khoản mới</CardTitle>
          <CardDescription>Điền thông tin bên dưới để đăng ký</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+84..."
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Đăng nhập tại đây
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
