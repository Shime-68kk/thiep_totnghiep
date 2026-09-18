# 🎓 Thiệp Mời Tốt Nghiệp - Trần Tùng Lâm ✨

> **Món quà thiệp mời tốt nghiệp tương tác đặc biệt của Trần Tùng Lâm (Tân Cử Nhân).**

---

## ✨ Điểm nổi bật
- 🎨 **Art Direction**: Tông màu Champagne / Ivory (`#FAF7F2`) ấm áp, kết hợp Royal Navy Blue (`#1E3A8A`) và Soft Warm Gold (`#D4AF37`).
- 💎 **Chất liệu Milk Glassmorphism**: Kính trắng mờ sữa cao cấp, viền đôi kim loại vàng, lớp phủ grain texture và quả cầu gradient trôi nhẹ.
- ⚡ **GSAP Motion Orchestration**: 
  - Hiệu ứng Magnetic Hover hút theo con trỏ chuột.
  - Nút "Không" nảy đàn hồi (Rubber-band Wiggle), nút "Có" đập nhịp tim to dần.
  - Sóng xung kích vàng kim (**Shockwave Ripple**) khi chọn đồng ý.
  - Pháo hoa giấy đa sắc (**Canvas Confetti Engine**).
  - Chuyển cảnh mở thiệp kiểu phong bì (**Card Unfolding**).
- 🥺 **Cơ chế tôn trọng từ chối (Lần 3)**:
  - Nếu người xem bấm "Không" đủ 3 lần, hệ thống hiển thị sticker buồn kèm bức thư cảm ơn chân thành và lời chúc tốt lành.
  - Người xem vẫn có nút bấm để tiếp tục vào xem chi tiết thiệp mời.
- 📱 **Responsive 100%**: Tối ưu hoàn hảo cho cả thiết bị di động (iPhone, Android) và màn hình máy tính.

---

## 📁 Cấu trúc thư mục

```text
├── assets/
│   └── images/
│       ├── buon.png
│       └── sticker_buon.png         # Sticker buồn đã tách nền trong suốt
├── css/
│   ├── variables.css                # Design tokens & bảng màu
│   ├── base.css                     # Resets, ambient glow & grain overlay
│   ├── scene1.css                   # Cảnh 1: Modal câu hỏi, co giãn nút, sticker từ chối
│   ├── scene2.css                   # Cảnh 2: Thiệp chính thức
│   └── main.css                     # Master CSS
├── js/
│   ├── vendor/
│   │   ├── gsap.min.js              # Thư viện GSAP Core
│   │   └── CustomEase.min.js
│   ├── effects/
│   │   ├── animations.js            # Module GSAP Orchestration & Physics
│   │   ├── confetti.js              # Engine pháo hoa Canvas Confetti
│   │   └── sparkles.js              # Hạt sao lấp lánh ban ngày
│   ├── scenes/
│   │   ├── scene1.js                # Controller Cảnh 1
│   │   └── scene2.js                # Controller Cảnh 2
│   └── main.js                      # Application Orchestrator & Router
└── index.html                       # Entry point
```

---

## 🚀 Triển khai & Truy cập trực tiếp

- **Trang web chính thức (Cloudflare Pages)**: [https://thiep-tunglam.pages.dev/](https://thiep-tunglam.pages.dev/)
- **Mã QR trực tiếp**: [Tải ảnh QR Code 800x800](https://api.qrserver.com/v1/create-qr-code/?size=800x800&margin=20&data=https://thiep-tunglam.pages.dev/)

---

## 💻 Hướng dẫn chạy cục bộ

```bash
# Khởi chạy server local:
python3 -m http.server 8080

# Mở trình duyệt truy cập:
# http://localhost:8080
```

